import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

const SubmissionView = () => {
    const { task_id, user_id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const response = await fetch(`http://localhost:3001/task/submission/${task_id}/${user_id}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result?.payload?.message || "Unknown error");
                }

                setData(result.payload.data);
                console.log(result.payload.data)
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSubmission();
    }, [task_id, user_id]);

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

    return (
        <>
            <Navbar manage={true} />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : !data ? (
                            <div className="text-center">Loading...</div>
                        ) : (
                            <div className="card shadow-sm rounded-4 border-0">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Submission Details</h3>

                                    <div className="mb-3">
                                        <strong>Submitter:</strong> <span className="text-muted">{data.user_name}</span>
                                    </div>

                                    <div className="mb-3">
                                        <strong>Task:</strong> <span className="text-muted">{data.task_title}</span>
                                    </div>

                                    <div className="mb-3">
                                        <strong>Status:</strong>{" "}
                                        <span>
                                            {formatStatus(data.status)}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <strong>Finished At: </strong>
                                        <span className="text-muted">
                                            {data.finished_at
                                                ? new Date(data.finished_at).toLocaleString("en-GB", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })
                                                : "—"}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <strong>Submission:</strong><br />
                                        <div className="mt-1 p-3 border rounded bg-light">
                                            {data.submission || <em>No submission provided.</em>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubmissionView;
