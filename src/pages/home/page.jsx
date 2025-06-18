import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import { FaUserShield, FaTasks } from "react-icons/fa";

const Home = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <>
            <Navbar home={true} />
            <main className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="card shadow-sm rounded-4 border-0 p-4" style={{ maxWidth: '500px', width: '100%' }}>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-1">Welcome back, {user?.name || 'User'}!</h2>
                        <p className="text-muted">
                            {isAdmin ? (
                                <>
                                    <FaUserShield className="me-2 text-primary" />
                                    Admin Dashboard: Manage your interns and tasks.
                                </>
                            ) : (
                                <>
                                    <FaTasks className="me-2 text-success" />
                                    Intern Panel: Track and complete your tasks.
                                </>
                            )}
                        </p>
                    </div>
                    <div className="text-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="Welcome Illustration"
                            style={{ maxWidth: '150px', opacity: 0.8 }}
                        />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;
