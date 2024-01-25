import { BASE_URL } from "../../config.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebase";
import apiInstance from "../../slices/ApiSlices.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPatientCredentials } from "../../slices/patientAuthSlice";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleclick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      console.log(provider, "provider");

      const auth = getAuth(app);
      console.log(auth, "auth");

      const result = await signInWithPopup(auth, provider);
      console.log(result, "Result from OAuth");

      const res = await apiInstance.post(`${BASE_URL}/users/google`, {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });

      const data=res.data

      console.log(data,"data")

      if(data){

          dispatch(setPatientCredentials(data))
          navigate('/users/home')
      }
    } catch (error) {
      console.error(error, "error in google");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleclick}
      className="w-full flex justify-center bg-gradient-to-r  hover:bg-gradient-to-l hover:from-gray-100 hover:to-indigo-200 text-black-100 p-4 mt-7  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
