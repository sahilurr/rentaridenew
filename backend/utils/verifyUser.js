// utils/verifyUser.js
import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/userModel.js";

/**
 * Accepts auth in either of these forms:
 * 1) Header with BOTH tokens:  Authorization: Bearer <refreshToken>,<accessToken>
 * 2) Header with ONLY access:  Authorization: Bearer <accessToken>
 * 3) Cookies (optional fallback): access_token / refresh_token
 *
 * If access is valid -> next()
 * If access is missing/expired but refresh is valid -> mints new tokens, attaches
 *   req.user and exposes new tokens via response headers so the client can persist them.
 */
export const verifyToken = async (req, res, next) => {
  try {
    // -------- read tokens from header or cookies ----------
    const auth = req.headers.authorization?.trim(); // e.g., "Bearer abc,def" or "Bearer def"
    let accessToken = null;
    let refreshToken = null;

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const bearerPayload = auth.slice(7); // remove "Bearer "
      if (bearerPayload.includes(",")) {
        // format: "<refresh>,<access>"
        const [rt, at] = bearerPayload.split(",").map(s => s.trim());
        refreshToken = rt || null;
        accessToken = at || null;
      } else {
        // format: "<access>"
        accessToken = bearerPayload;
      }
    }

    // cookie fallback (if you keep cookies for web)
    if (!accessToken) accessToken = req.cookies?.access_token || null;
    if (!refreshToken) refreshToken = req.cookies?.refresh_token || null;

    if (!accessToken && !refreshToken) {
      return next(errorHandler(403, "bad request no header provided"));
    }

    // -------- try verifying the access token first ----------
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
        req.user = decoded.id;
        return next();
      } catch (err) {
        // fall through to refresh path only if it expired
        if (err.name !== "TokenExpiredError") {
          return next(errorHandler(403, "Token is not valid"));
        }
        // else continue to refresh flow
      }
    }

    // -------- access missing/expired: use refresh token ----------
    if (!refreshToken) {
      return next(errorHandler(401, "You are not authenticated"));
    }

    // validate refresh token
    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const user = await User.findById(decodedRefresh.id);
    if (!user) return next(errorHandler(403, "Invalid refresh token"));
    if (!user.refreshToken || user.refreshToken !== refreshToken) {
      return next(errorHandler(403, "Invalid refresh token"));
    }

    // mint new tokens
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // persist new refresh token
    await User.updateOne({ _id: user._id }, { refreshToken: newRefreshToken });

    // expose for client to store (headers are simple + CORS-safe)
    res.setHeader("x-new-access-token", newAccessToken);
    res.setHeader("x-new-refresh-token", newRefreshToken);

    // proceed as authenticated
    req.user = user._id.toString();
    return next();
  } catch (error) {
    console.error("verifyToken error:", error);
    return next(errorHandler(401, "Authentication failed"));
  }
};
