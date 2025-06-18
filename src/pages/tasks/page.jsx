import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import TasksCard from "../../components/tasksCard/tasksCard";
import { useAuth } from "../../context/AuthContext";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:3001/tasks/user/${user.id}`);
        const result = await res.json();

        const taskData = result[0]?.payload?.data;
        if (taskData) {
          setTasks(taskData);
        } else {
          console.error("Failed to fetch tasks:", result[0]?.message || "No data found");
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    if (user?.id) {
      fetchTasks();
    }
  }, [user?.id]);

  return (
    <>
      <Navbar tasks={true} />
      <div className="py-5" style={{ minHeight: "100vh" }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold text-primary">Finish your Tasks !</h2>
          <div className="row justify-content-center gx-4 gy-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <TasksCard
                    taskId={task.id}
                    cardTitle={task.title}
                    cardDescription={task.description}
                    status={task.status}
                    dueDate={task.due_date}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">No tasks assigned to you yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
