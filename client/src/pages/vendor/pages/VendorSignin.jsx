import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../../redux/user/userSlice";
import styles from "../../..";
import VendorOAuth from "../../../components/VendorAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  password: z.string().min(1, { message: "password required" }),
});

function VendorSignin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { isLoading, isError } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("api/vendor/vendorsignin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.succes === false) {
        dispatch(signInFailure(data));
        return;
      }
      if (data.isVendor) {
        navigate("/vendorDashboard");
        dispatch(signInSuccess(data));
      }
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <>
      <div
        className={`pb-10 max-w-lg mx-auto mt-16  rounded-lg overflow-hidden  shadow-2xl`}
      >
        <div
          className={` bg-slate-950 px-6 py-2   rounded-t-lg flex justify-between items-center`}
        >
          <h1 className={`${styles.heading2}  text-normal text-white `}>
            Sign In <span className="text-white text-[8px]">as vendor</span>
          </h1>
          <Link to={"/"}>
            <div className=" px-3  font-bold  hover:bg-slate-600 rounded-md text-white  shadow-inner">
              x
            </div>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 pt-10 px-5"
        >
          <div>
            <input
              type="text"
              id="email"
              className="text-black bg-slate-100 p-3 rounded-md w-full"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              id="password"
              className="text-black bg-slate-100 p-3 rounded-md w-full"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-[10px]">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            className={`${styles.button} bg-slate-950 text-white  disabled:bg-slate-500 disabled:text-white`}
            disabled={isLoading}
          >
            {isLoading ? "Loading ..." : "Login"}
          </button>
          <div className="flex justify-between">
            <div className="flex justify-between">
              <p className="text-[10px] border-r border-black">
                No account?{" "}
                <span className="text-blue-600 pr-2">
                  {" "}
                  <Link to={`/vendorsignup`}>Sign Up</Link>
                </span>
              </p>
              <p className="text-[10px] pl-2 text-blue-600">forgot password</p>
            </div>

            <p className="text-[10px] text-red-600">
              {isError ? isError.message || "something went wrong" : " "}
            </p>
          </div>
        </form>
        <div>
          <h3 className="text-center text-slate-700 pt-3 pb-3 text-[10px]">
            OR
          </h3>
          <div className="flex justify-center items-center gap-3 pb-6">
            <span className="bg-green-300 w-20 h-[.1px]"></span>
            <span className="text-[10px] sm:text-[12px] text-slate-500">
              Continue with social login
            </span>
            <span className="bg-green-300 w-20 h-[.1px]"> </span>
          </div>

          <VendorOAuth />
        </div>
      </div>
    </>
  );
}

export default VendorSignin;
