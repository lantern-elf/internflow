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
    <div className="card shadow-sm border-0 rounded-4 h-100">
      <div className="card-body d-flex flex-column justify-content-between">
        {/* Title & Status */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold text-uppercase">{cardTitle}</h5>
          {status && formatStatus(status)}
        </div>

        {/* Description */}
        <p
          className="card-text text-muted mb-3"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {cardDescription}
        </p>

        {/* Due Date */}
        {dueDate && (
          <p className="text-muted mb-3">
            <small>Due: {new Date(dueDate).toLocaleDateString()}</small>
          </p>
        )}

        {/* Buttons */}
        <div className="mt-auto d-flex gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/task/${taskId}`)}
            className="btn btn-sm btn-info"
          >
            View
          </button>
          {user?.role === "admin" && typeof handleDelete === "function" && (
            <button
              onClick={() => handleDelete(taskId)}
              className="btn btn-sm btn-outline-danger"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksCard;
