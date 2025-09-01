import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import TasksCard from "../../components/tasksCard/tasksCard";

const API_URL = "http://localhost:3001/users";

const UserView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", role: "" });

    // Fetch user detail
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_URL}/${id}`);
                const result = await response.json();
                const userData = result?.payload?.data?.[0];
                if (userData) setUser(userData);
                else console.error("User not found");
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, [id]);

    // Set form state when user data is loaded
    useEffect(() => {
        if (user) {
            setEditForm({ name: user.name, role: user.role });
        }
    }, [user]);

    // Fetch user's assigned tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch(`http://localhost:3001/tasks/user/${id}`);
                const taskResult = await res.json();
                const taskData = taskResult?.payload?.data;
                if (taskData) setTasks(taskData);
                else console.error("No task data found");
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };
        fetchTasks();
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle user update
    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmUpdate = window.confirm("Are you sure you want to update this user?");
        if (!confirmUpdate) return;

        try {
            const res = await fetch("http://localhost:3001/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user.id,
                    name: editForm.name,
                    role: editForm.role
                })
            });
            const result = await res.json();

            if (res.ok) {
                setUser((prev) => ({
                    ...prev,
                    name: editForm.name,
                    role: editForm.role
                }));
                setIsEditing(false);
            } else {
                alert("Update failed.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Server error.");
        }
    };

    // Format role badge color
    const formatRole = (role) => {
        switch (role) {
            case "admin": return "bg-danger";
            case "intern": return "bg-secondary";
            case "editor": return "bg-warning text-dark";
            default: return "bg-light";
        }
    };

    // While loading
    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar manage={true} />
            <div className="container py-5">
                <div className="row justify-content-center">

                    {/* Left Column: User Info */}
                    <div className="col-md-3">
                        <div className="card border-0 mb-4">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">User Detail</h4>
                                <button
                                    className="btn btn-light btn-sm"
                                    onClick={() => setIsEditing((prev) => !prev)}
                                >
                                    {isEditing ? "Cancel" : "Edit"}
                                </button>
                            </div>
                            <div className="card-body">
                                {isEditing ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Role</label>
                                            <select
                                                className="form-select"
                                                name="role"
                                                value={editForm.role}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="intern">Intern</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-success w-100">
                                            Save Changes
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <p><strong>ID:</strong> {user.id}</p>
                                        <p><strong>Name:</strong> {user.name}</p>
                                        <p>
                                            <strong>Role:</strong>{" "}
                                            <span className={`badge ${formatRole(user.role)} ms-2 text-capitalize`}>
                                                {user.role}
                                            </span>
                                        </p>
                                        <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tasks */}
                    <div className="col-md-7">
                        <div className="card border-0">
                            <div className="card-header bg-primary text-white">
                                <h4 className="mb-0">Assigned Tasks</h4>
                            </div>
                            <div className="card-body overflow-auto" style={{ height: "68vh" }}>
                                {tasks.length > 0 ? (
                                    <div className="row row-cols-1 row-cols-md-2 g-3">
                                        {tasks.map((task) => (
                                            <div key={task.id} className="col">
                                                <TasksCard
                                                    taskId={task.id}
                                                    cardTitle={task.title}
                                                    cardDescription={task.description}
                                                    status={task.status}
                                                    dueDate={task.due_date}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No tasks found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default UserView;
