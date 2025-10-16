import { GoogleAuthProvider, signInWithPopup, getAuth } from "@firebase/auth";
import { app } from "../firebase";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function VendorOAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleVendorGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/vendor/vendorgoogle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      console.log(res)
      const data = await res.json();
      console.log(data)
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/vendorDashboard')
      }
      else{
        dispatch(signInFailure(data))
        navigate('/vendorSignin')
        
      }
     
      
    } catch (error) {
      console.log('could not login with google ', error);
    }
  };
  return (
    <div className={`px-5`}>
      <button
        className="flex w-full gap-3 justify-center border  py-3 rounded-md  items-center  border-black mb-4"
        type="button"
        onClick={handleVendorGoogleClick}
      >
        <span className="icon-[devicon--google]"></span>
        <span>Continue with Google</span>
      </button>
     
    </div>
  );
}

export default VendorOAuth;
