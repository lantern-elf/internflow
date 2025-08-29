import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import { FaUserTie, FaTasks, FaCheckCircle, FaUserPlus } from "react-icons/fa";

const Home = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [totalInterns, setTotalInterns] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [ongoingTasks, setOngoingTasks] = useState(0);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (isAdmin) {
            fetchInternCount();
            fetchTaskStatus();
        } else if (user?.id) {
            fetchUserTasks(user.id);
        }
    }, [user?.id, isAdmin]);

    const fetchInternCount = async () => {
        try {
            const res = await fetch("http://localhost:3001/users");
            const result = await res.json();

            const data = result?.[0]?.payload?.data;
            if (Array.isArray(data)) {
                const interns = data.filter((user) => user.role === "intern");
                setTotalInterns(interns.length);
            } else {
                console.error("Unexpected intern data structure:", result);
            }
        } catch (err) {
            console.error("Error fetching interns:", err);
        }
    };

    const fetchTaskStatus = async () => {
        try {
            const res = await fetch("http://localhost:3001/tasks");
            const result = await res.json();

            const taskList = result?.[0]?.payload?.data;
            if (!Array.isArray(taskList)) {
                console.error("Unexpected task list structure:", result);
                return;
            }

            let completed = 0;
            let ongoing = 0;

            const taskUserLists = await Promise.all(
                taskList.map(async (task) => {
                    const res = await fetch(`http://localhost:3001/task/${task.id}`);
                    const taskResult = await res.json();
                    return taskResult?.[0]?.payload?.data?.assigned_users || [];
                })
            );

            const allAssignments = taskUserLists.flat();
            completed = allAssignments.filter((t) => t.status === "completed").length;
            ongoing = allAssignments.filter((t) => t.status !== "completed").length;

            setCompletedTasks(completed);
            setOngoingTasks(ongoing);
        } catch (err) {
            console.error("Error fetching task status:", err);
        }
    };

    const fetchUserTasks = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/tasks/user/${id}`);
            const result = await res.json();
            const taskData = result?.[0]?.payload?.data;

            if (Array.isArray(taskData)) {
                setTasks(taskData);
                setCompletedTasks(
                    taskData.filter((t) => t.status === "completed").length
                );
                setOngoingTasks(
                    taskData.filter((t) => t.status !== "completed").length
                );
            } else {
                console.error("Unexpected task format:", result);
            }
        } catch (err) {
            console.error("Failed to fetch intern tasks", err);
        }
    };

    const formatStatus = (status) => {
        switch (status) {
          case "in_progress":
            return <span className="badge bg-warning text-dark">In Progress</span>;
          case "completed":
            return <span className="badge bg-success">Completed</span>;
          default:
            return <span className="badge bg-secondary">Unknown</span>;
        }
    };

    return (
        <>
            <Navbar home={true} />
            <main className="container py-5">
                <div className="mb-5 text-center">
                    <h2 className="fw-bold">Welcome back, {user?.name || "User"}!</h2>
                    <p className="text-muted">
                        {isAdmin ? (
                            <>
                                <FaUserTie className="me-2 text-primary" />
                                Admin Dashboard — Monitor and manage interns and tasks.
                            </>
                        ) : (
                            <>
                                <FaTasks className="me-2 text-success" />
                                Intern Panel — Track your assigned tasks here.
                            </>
                        )}
                    </p>
                </div>

                {isAdmin && (
                    <>
                        {/* Admin Stat Cards */}
                        <div className="row g-4 mb-5">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                                    <FaUserPlus size={32} className="text-primary mb-2" />
                                    <h5>Total Interns</h5>
                                    <p className="fw-bold fs-4">{totalInterns}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                                    <FaTasks size={32} className="text-warning mb-2" />
                                    <h5>Ongoing Tasks</h5>
                                    <p className="fw-bold fs-4">{ongoingTasks}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                                    <FaCheckCircle size={32} className="text-success mb-2" />
                                    <h5>Completed Tasks</h5>
                                    <p className="fw-bold fs-4">{completedTasks}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {!isAdmin && (
                    <>
                        {/* Intern Task Summary */}
                        <div className="row g-4 mb-5 justify-content-center">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                                    <FaTasks size={32} className="text-warning mb-2" />
                                    <h5>Ongoing Tasks</h5>
                                    <p className="fw-bold fs-4">{ongoingTasks}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                                    <FaCheckCircle size={32} className="text-success mb-2" />
                                    <h5>Completed Tasks</h5>
                                    <p className="fw-bold fs-4">{completedTasks}</p>
                                </div>
                            </div>
                        </div>

                        {/* Latest Task List */}
                        <div className="card border-0 shadow rounded-4 p-4">
                            <h4 className="fw-bold mb-4">Your Assigned Tasks</h4>
                            {tasks.length === 0 ? (
                                <p className="text-muted">No tasks assigned yet.</p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {tasks.slice(0, 5).map((task) => (
                                        <li
                                            key={task.id}
                                            className="list-group-item d-flex justify-content-between align-items-start px-0"
                                        >
                                            <div className="me-auto">
                                                <div className="fw-bold">{task.title}</div>
                                                <small className="text-muted">
                                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <span>
                                                {formatStatus(task.status)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default Home;
