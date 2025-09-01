import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./style.css";
import Navbar from "../../components/navbar/Navbar";

const Test = () => {
    const API_URL = "http://localhost:3001/users";
    const [users, setUsers] = useState([]);
    const [userDataToEdit, setUserDataToEdit] = useState({});
    const [isEditShow, setIsEditShow] = useState()
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const handleView = (id) => {
        navigate(`/test/${id}`);
    };

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            if (result?.payload?.data) {
                setUsers(result.payload.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData)
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("Response:", data);

            // Refresh the user list after successful submission
            fetchUsers();

            // Reset form fields
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "",
            });
        } 
        catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleEditChange = (e) => {
        setUserDataToEdit({ ...userDataToEdit, [e.target.name]: e.target.value });
    };

    const handleEditModal = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const result = await response.json();

            console.log("Full API Response:", result);
            
            if (Array.isArray(result?.payload?.data) && result.payload.data.length > 0) {
                const userData = result.payload.data[0]; // Select the first object
                console.log("User Data Found (Before Set State):", userData);

                setUserDataToEdit(userData);

                // Use a `useEffect` to observe `userDataToEdit` instead of logging right after setting state
                console.log("UserDataToEdit (After Set State, inside useEffect):", userData);
                
                setIsEditShow(true);
            } else {
                console.error("No user data found", result?.payload?.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    const handleCloseEditModal = () => {
        setIsEditShow(false)
        setUserDataToEdit({});
    }

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userDataToEdit),
            });

            const data = await response.json();
            console.log("Response:", data);

            // Refresh the user list after successful submission
            fetchUsers();
            setIsEditShow(false)

            // Reset form fields
            setUserDataToEdit({});
        } 
        catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try{
            const response = await fetch (API_URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            })
            fetchUsers(); // Refresh the list after deletion
        }
        catch{
            console.error("Error deleting user:", error);
        }
    }

    return (
        <>  
            <Navbar test={true} />
            <h1>List Data</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th colSpan={3}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.password_hash}</td>
                                <td>{user.role}</td>
                                <td>{user.created_at}</td>
                                <td align="center"><button onClick={() => handleDelete(user.id)}>Delete</button></td>
                                <td align="center"><button onClick={() => {handleEditModal(user.id)} }>Edit</button></td>
                                <td align="center"><button onClick={() => handleView(user.id)}>view</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td align="center" colSpan="7">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <br />
            <h1>Input Data</h1>
            <form onSubmit={handleSubmit}>
                <label>Name:</label><br />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                <br /><br />

                <label>Email:</label><br />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                <br /><br />
                
                <label>Password:</label><br />
                <input type="password" name="password" value={formData.password_hash} onChange={handleChange} required />
                <br /><br />
                
                <label>Role:</label><br />
                <input type="text" name="role" value={formData.role} onChange={handleChange} required />
                <br /><br />

                <input type="submit" value="Submit" />
            </form>

            {/* modal */}
            {isEditShow && (
                <div className="modal">
                    <button onClick={() => handleCloseEditModal()} className="close-modal">
                        close
                    </button>
                    <form onSubmit={handleEdit}>
                        <label>ID:</label><br />
                        <input type="text" name="id" value={userDataToEdit.id || ""} readOnly />
                        <br /><br />

                        <label>Name:</label><br />
                        <input type="text" name="name" value={userDataToEdit.name} onChange={handleEditChange} required />
                        <br /><br />

                        <label>Email:</label><br />
                        <input type="email" name="email" value={userDataToEdit.email} onChange={handleEditChange} required />
                        <br /><br />
                        
                        <label>Role:</label><br />
                        <input type="text" name="role" value={userDataToEdit.role} onChange={handleEditChange} required />
                        <br /><br />

                        <input type="submit" value="Submit" />
                    </form>
                </div>
            )}
        </>
    );
};

export default Test;
