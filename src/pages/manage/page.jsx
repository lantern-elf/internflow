import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import TasksCard from "../../components/tasksCard/tasksCard";

const Manage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        due_date: "",
        user_ids: [],
    });

    const isFormValid = () => {
        const { title, description, due_date, user_ids } = newTask;
        return title.trim() !== "" && description.trim() !== "" && due_date !== "" && user_ids.length > 0;
    };
    
    const fetchData = async () => {
        try {
            const [resUsers, resTasks] = await Promise.all([
                fetch("http://localhost:3001/users"),
                fetch("http://localhost:3001/tasks")
            ]);

            if (!resUsers.ok || !resTasks.ok) {
                throw new Error("Failed to fetch users or tasks.");
            }

            const [resultUsers, resultTasks] = await Promise.all([
                resUsers.json(),
                resTasks.json()
            ]);

            const userData = resultUsers[0]?.payload?.data;
            const taskData = resultTasks[0]?.payload?.data;

            if (userData && taskData) {
                setUsers(userData);
                setTasks(taskData);
            } else {
                console.error("Unexpected data shape:", {
                    users: resultUsers,
                    tasks: resultTasks
                });
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteTask = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;

        try {
            await fetch("http://localhost:3001/tasks", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            })
            fetchData();
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    }

    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await fetch("http://localhost:3001/users", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
            fetchData();
        } catch (error) {
            console.error("Error deleting user: ", error);
        }
    };

    const handleTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };

    const handleUserSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setNewTask(prev => ({ ...prev, user_ids: selected }));
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Task created successfully!");
                setNewTask({ title: "", description: "", due_date: "", user_ids: [] });
                fetchData();
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error submitting task:", error);
        }
    };

    return (
        <>
            <Navbar manage={true} />
            <div className="container-fluid mt-3">
                <div className="row" style={{ height: "90vh" }}>
                    {/* Column 1: Users */}
                    <div className="col-md-4 border-end overflow-auto" style={{ height: '88vh' }}>
                        <h5 className="mb-3">Interns</h5>
                        <table className="table table-light table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    <th colSpan="2" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td className="text-capitalize">{user.role}</td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td align="center"><button onClick={() => navigate(`/user/${user.id}`)} className="btn btn-info btn-sm">View</button></td>
                                            <td align="center"><button disabled={user.role === 'admin'} onClick={() => handleDeleteUser(user.id)} className="btn btn-danger btn-sm">Delete</button></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6">No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Column 2: Tasks (Scrollable) */}
                    <div className="col-md-4 border-end d-flex flex-column overflow-auto" style={{ height: '88vh' }}>
                        <h5 className="mb-3">Tasks</h5>
                        <div className="flex-grow-1 overflow-auto">
                            <div
                            className="d-grid"
                            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}
                            >
                            {tasks.length > 0 ? (
                                tasks.map(task => (
                                <TasksCard
                                    key={task.id}
                                    taskId={task.id}
                                    cardTitle={task.title}
                                    cardDescription={task.description}
                                    dueDate={task.due_date}
                                    handleDelete={handleDeleteTask}
                                />
                                ))
                            ) : (
                                <p>No tasks found.</p>
                            )}
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Task Input Form */}
                    <div className="col-md-4" style={{ height: "88vh", position: "sticky", top: "2rem" }}>
                        <h5>Add New Task</h5>
                        <form onSubmit={handleTaskSubmit}>
                            <label>Title</label>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    placeholder="Title"
                                    value={newTask.title}
                                    onChange={handleTaskChange}
                                    required
                                />
                            </div>
                            <label>Description</label>
                            <div className="mb-2">
                                <textarea
                                    className="form-control"
                                    name="description"
                                    placeholder="Description"
                                    value={newTask.description}
                                    onChange={handleTaskChange}
                                    required
                                />
                            </div>
                            {/* <label>Status</label>
                            <div className="mb-2">
                                <select
                                    className="form-select"
                                    name="status"
                                    value={newTask.status}
                                    onChange={handleTaskChange}
                                >
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div> */}
                            <label>Due Date</label>
                            <div className="mb-2">
                                <input
                                    type="date"
                                    className="form-control"
                                    name="due_date"
                                    value={newTask.due_date}
                                    onChange={handleTaskChange}
                                    required
                                />
                            </div>
                            <label>Assign Users</label>
                            <div className="mb-3" >
                                <div className="form-check d-flex flex-column overflow-auto" style={{ maxHeight: '30vh', paddingLeft: '1rem' }}>
                                    {users.map((user) => (
                                        <div key={user.id} className="form-check mb-1">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={user.id}
                                                id={`user-${user.id}`}
                                                checked={newTask.user_ids.includes(user.id)}
                                                onChange={(e) => {
                                                    const id = parseInt(e.target.value);
                                                    setNewTask((prev) => {
                                                        const user_ids = e.target.checked
                                                            ? [...prev.user_ids, id]
                                                            : prev.user_ids.filter((uid) => uid !== id);
                                                        return { ...prev, user_ids };
                                                    });
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`user-${user.id}`}>
                                                {user.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={!isFormValid()}>
                                Create Task
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Manage;
