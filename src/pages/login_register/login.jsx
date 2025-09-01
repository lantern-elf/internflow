import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
// import KominfoLogo from "/mnt/data/c906b848-7bb6-497e-b98a-e49dc89bf38f.png"; // adjust path if needed

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const endPoint = "http://localhost:3001/login";
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

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

      if (!data.ok) {
        setLoginError(true);
        setErrorMessage(data.payload.message);
      }

      if (data?.payload?.data) {
        const { id, name, role } = data.payload.data;
        login({ id, name, role });
        navigate("/home");
      }

      setFormData({
        id: "",
        password: "",
      });
    } catch (error) {
      setLoginError(true);
      setErrorMessage("Internal Error");
    }
  };

  return (
    <>
      <Navbar login={true} />
      {/* Top Title & Logo */}
      <div className="text-center py-4 px-4">
        <img
          src={"https://diskominfo.penajamkab.go.id/wp-content/uploads/2020/02/logo-kominfo.png"}
          alt="Logo DPRD Kota Palembang"
          style={{ width: "150px", marginBottom: "10px" }}
        />
        <h5 className="mb-0">SISTEM INFORMASI MANAJEMEN TUGAS PEGAWAI MAGANG BERBASIS WEB</h5>
        <h5 className="fw-bold">DISKOMINFO KOTA PALEMBANG</h5>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="d-flex justify-content-center align-items-sm-center p-2"
        style={{ height: "" }}
      >
        <div className="d-flex flex-column gap-3 col-12 col-sm-3 p-sm-2">
          <h3 align="center">Sign In</h3>
          <div>
            <label className="form-label">User ID</label>
            <input
              value={formData.id}
              onChange={handleChange}
              name="id"
              className="form-control"
              required
            />
          </div>
          <div>
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
          {loginError && (
            <span className="text-danger">{errorMessage}</span>
          )}
          {!loginError && (
            <span className="text-muted">{"Enter your Id and Password"}</span>
          )}
          <button type="submit" className="btn btn-primary w-100">
            Sign In
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
