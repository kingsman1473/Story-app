import  { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper"; // Adjust the path as necessary
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");

    // login api call

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        setTimeout(() => navigate("/dashboard"), 0);
      }

    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }else{
        setError("Something went wrong");
      }
    }
  };

 


  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />

      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />

      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/5 h-[90vh] flex items-end bg-[url('./src/assets/images/login-bg.png')] bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Capture Your <br /> jorneys
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Record your travel experiences and memories tarvel journal.
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handlelogin}>
            <h4 className="text-2xl font-semibold md-7">Login</h4>

            <input type="text" placeholder="Email" className="input-box"
              value={email}
              onChange={({target})=> setEmail(target.value)}
            />

            <PasswordInput value={password}
              onChange={({ target }) => setPassword(target.value)} />
            
            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-xs text-state-500 text-center my-4">Or</p>

            <button
              type="submit"
              className="btn-primary btn-light"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
