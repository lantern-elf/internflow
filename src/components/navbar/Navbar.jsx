import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ home = false, tasks = false, manage = false, login = false, about = false }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-light sticky-top" style={{ height: '8vh' }}>
            <div className="container-fluid">
                <a className="navbar-brand d-flex gap-2 align-items-center" style={{ cursor: 'pointer' }} href="/">
                    <img
                        style={{ height: '32px' }}
                        src="https://diskominfo.penajamkab.go.id/wp-content/uploads/2020/02/logo-kominfo.png"
                        alt="logo"
                    />
                    Internflow
                    {user?.role === 'admin' && <span className="text-muted"> admin</span>}
                </a>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        {user && (
                            <>
                                <li className="nav-item">
                                    <a className={`nav-link ${home ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>Home</a>
                                </li>

                                {user?.role === 'intern' && (
                                    <li className="nav-item">
                                        <a className={`nav-link ${tasks ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => navigate('/tasks')}>Tasks</a>
                                    </li>
                                )}

                                {user?.role === 'admin' && (
                                    <li className="nav-item">
                                        <a className={`nav-link ${manage ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => navigate('/manage')}>Manage</a>
                                    </li>
                                )}
                            </>
                        )}

                        <li className="nav-item">
                            <a className={`nav-link ${about ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => navigate('/about')}>About</a>
                        </li>
                        
                        {!user && (
                            <li className="nav-item">
                                <a className={`nav-link ${login ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => navigate('/Login')}>Sign In</a>
                            </li>
                        )}
                        
                        {user &&(
                            <li className="nav-item ms-3">
                                <button
                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                    title="Logout"
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
