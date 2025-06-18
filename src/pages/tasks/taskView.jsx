import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TaskView = () => {
    const { user } = useAuth()
    const navigate = useNavigate();
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [userAssign, setUserAssign] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [submission, setSubmission] = useState("")
    const [taskStatus, setTaskStatus] = useState(null)

    const fetchTask = async () => {
        try {
            const response = await fetch(`http://localhost:3001/task/${id}`);
            const result = await response.json();
            if (result) {
                const data = result[0].payload.data;
                setTask(data);
                console.log(result[0].payload.data)
                setUserAssign(data?.assigned_users || [])
            }
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(task)
    };
    
    const handleSubmitionChange = (e) => {
        setSubmission(e.target.value);
        console.log(submission)
    };    

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:3001/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    due_date: task.due_date,
                }),
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Task updated successfully!");
                setIsEditing(false);
                fetchTask(); // Refresh task
            } else {
                console.error("Failed to update task:", result.message);
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };
    
    const handleSubmission = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/task/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    task_id: task.id,
                    submission: submission,
                }),
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Submission successful!");
                fetchUsertaskStatus()
                setSubmission(""); // Clear form
            } else {
                console.error("Failed to submit:", result[0]?.payload.message);
            }
        } catch (error) {
            console.error("Error submitting:", error);
        }
    };    

    const fetchUsertaskStatus = async () => {
        try {
            const response = await fetch(`http://localhost:3001/task/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ task_id: id, user_id: user.id })
            });
            const result = await response.json();
            if (!response.ok) {
                return
            }
            setTaskStatus(result[0].payload.data.status)
        } catch (error) {
            console.error("Error fetching status:", error);
        }
    };
    
    useEffect(() => {
        fetchUsertaskStatus();
    }, []);

    const formatStatus = (status) => {
        switch (status) {
            case 'in_progress':
                return <span className="badge bg-warning text-dark">In Progress</span>;
            case 'completed':
                return <span className="badge bg-success">Completed</span>;
            default:
                return <span className="badge bg-secondary">Unknown</span>;
        }
    };

    if (!task) return <p>Loading data...</p>;

    return (
        <>
            <Navbar manage={true} tasks={true} />
            <div className="container py-5">
                <div className="row justify-content-center">
                    {/* LEFT SIDE: Detail & Submission */}
                    <div className="col-md-4 d-flex flex-column gap-4">
                        {/* Task Detail Card */}
                        <div className="card border-0">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Task Detail</h4>
                                {user.role === 'admin' && (
                                    <button className="btn btn-light btn-sm" onClick={() => setIsEditing(!isEditing)} >
                                        {isEditing ? "Cancel" : "Edit"}
                                    </button>
                                )}
                            </div>
                            <div className="card-body">
                                {isEditing ? (
                                    <form onSubmit={handleUpdate}>
                                        <div className="mb-2">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={task.title}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Description</label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                value={task.description}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>Due Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="due_date"
                                                value={task.due_date?.slice(0, 10)}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-success w-100">
                                            Save Changes
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <p><h3 className="text-uppercase">{task.title}</h3></p>
                                        <p>{task.description}</p>
                                        <p><strong>Status: </strong>{formatStatus(taskStatus)}</p>
                                        <p><strong>Created At: </strong>{new Date(task.created_at).toLocaleDateString()}</p>                                        
                                        <p><strong>Due Date: </strong>{new Date(task.due_date).toLocaleDateString()}</p>                                        
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* Submission Card */}
                        {user.role !== 'admin' && (
                            <div className="card border-0">
                                <div className="card-header bg-primary text-white">
                                    <h4 className="mb-0">Submit Your Work</h4>
                                </div>
                                <form onSubmit={handleSubmission} className="card-body">
                                    <textarea
                                        name="sumbission_text"
                                        className="form-control mb-3"
                                        placeholder="Enter submission link or description..."
                                        value={submission}
                                        onChange={handleSubmitionChange}
                                        rows={4}
                                    />
                                    <button type="submit" className="btn btn-primary w-100">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Assigned Users */}
                    {user.role === 'admin' && (
                        <div className="col-md-7 mt-5 mt-md-0 text-size-2">
                            <div className="card border-0">
                                <div className="card-header bg-primary text-white">
                                    <h4 className="mb-0">Assigned Users</h4>
                                </div>
                                <div className="card-body overflow-auto">
                                    <table className="table table-light table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th className="text-center">Task Status</th>
                                                <th colSpan={2} className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userAssign.length > 0 ? (
                                                userAssign.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{user.id}</td>
                                                        <td>{user.name}</td>
                                                        <td className="text-capitalize">{user.role}</td>
                                                        <td align="center">{formatStatus(user.status)}</td>
                                                        <td align="center">
                                                            <button onClick={() => navigate(`/user/${user.id}`)} className="btn btn-info btn-sm">
                                                                View Detail
                                                            </button>
                                                        </td>
                                                        <td align="center">
                                                            <button onClick={() => navigate(`/task/submission/${id}/${user.id}`)} className="btn btn-info btn-sm">
                                                                View Submission
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="4">No users assigned.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TaskView;
