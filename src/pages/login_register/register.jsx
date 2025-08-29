import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

const Register = () => {
    const navigate = useNavigate();
    const endPoint = "http://localhost:3001/users";
    const [formData, setFormData] = useState({
        name: "",
        createPassword: "",
        confirmPassword: "",
        password: "",  // Will be assigned after validation
    });

    const [ registerError, setRegisterError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, createPassword, confirmPassword } = formData;

        if (createPassword !== confirmPassword) {
            // alert("Passwords do not match!");
            setErrorMessage("Passwords do not match!")
            setRegisterError(true)
            return;
        }

        const finalData = {
            name,
            password: createPassword, // validated
        };

        try {
            const res = await fetch(endPoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(finalData)
            });
            if (!res.ok) {
                console.log(res)
            } else {
                alert("Registration successful!");
                navigate("/manage");
            }
        } catch (err) {
            console.error("Error during registration:", err);
        }
    };

    return (
        <>
            <Navbar/>
            <form onSubmit={handleSubmit} className="d-flex justify-content-center align-items-sm-center p-2" style={{ height: '92vh' }}>
                <div className="d-flex flex-column gap-3 col-12 col-sm-3 p-sm-2">
                    <h3>Create Account</h3>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input placeholder="Jonh Doe" onChange={handleChange} name="name" type="text" className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Create Password</label>
                        <input onChange={handleChange} name="createPassword" type="text" className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input onChange={handleChange} name="confirmPassword" type="text" className="form-control" required />
                    </div>
                    {registerError === true && (
                        <span className="text-danger">{errorMessage}</span>
                    )}
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>
            </form>
        </>
    );
};

export default Register;
