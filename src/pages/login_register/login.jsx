import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const endPoint = "http://localhost:3001/login";
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [ loginError, setLoginError ] = useState(false)
  const [ errorMessage, setErrorMessage ] = useState()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.ok){
        setLoginError(true)
        setErrorMessage(data[0].payload.message)
      }

      if (data[0]?.payload?.data) {
        const id = data[0].payload.data.id;
        const name = data[0].payload.data.name;
        const role = data[0].payload.data.role;
        login({ id, name, role }); // Save to context
        navigate("/home");
      }

      setFormData({
        id: "",
        password: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Navbar login={true} />
      <form
        onSubmit={handleLogin}
        className="d-flex justify-content-center align-items-sm-center p-2"
        style={{ height: "92vh" }}
      >
        <div className="d-flex flex-column gap-3 col-12 col-sm-3 p-sm-2">
          <h3>Sign In</h3>
          <div className="">
            <label className="form-label">User ID</label>
            <input
              value={formData.id}
              onChange={handleChange}
              name="id"
              className="form-control"
              required
            />
          </div>
          <div className="">
            <label className="form-label">Password</label>
            <input
              value={formData.password}
              onChange={handleChange}
              name="password"
              type="password"
              className="form-control"
              required
            />
          </div>
          {loginError === true && (
            <span className="text-danger">{errorMessage}</span>
          )}
          <button type="submit" className="btn btn-primary w-100">
            Sign In
          </button>
          <span>
            {/* Have no account? <a href="/register">Sign Up here</a> */}
          </span>
        </div>
      </form>
    </>
  );
};

export default Login;
