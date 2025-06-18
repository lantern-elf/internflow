import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TasksCard = ({
  taskId,
  cardTitle = "Card Title",
  cardDescription = "This is the card description.",
  status,
  dueDate = "",
  handleDelete = null,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div className="card shadow-sm" style={{ minHeight: "250px" }}>
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="text-uppercase card-title">{cardTitle}</h5>
          <p className="card-text text-muted"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              minHeight: "60px",
              maxHeight: "60px",
            }}
          >
            {cardDescription}
          </p>
          {status && (
            <div className="mb-2">{formatStatus(status)}</div>
          )}
          {dueDate && (
            <p className="card-text">
              <small className="text-muted">
                Due: {new Date(dueDate).toLocaleDateString()}
              </small>
            </p>
          )}
        </div>
        <div className="d-flex gap-2 flex-wrap">
            <button onClick={() => navigate(`/task/${taskId}`)} className="btn-sm btn btn-info">
              View
            </button>
            {user?.role === "admin" && (
              <>
                {typeof handleDelete === "function" && (
                    <button onClick={() => handleDelete(taskId)} className="btn-sm btn btn-outline-danger">Delete</button>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default TasksCard;
