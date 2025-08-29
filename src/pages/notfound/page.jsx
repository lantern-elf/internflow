import Navbar from "../../components/navbar/Navbar"

const NotFound = () => {
    return(
        <>
            <Navbar />
            <div className="custom-bg text-dark">
                <div className="d-flex align-items-center justify-content-center min-vh-100">
                    <div className="text-center">
                        <h1 className="display-1 fw-bold">404</h1>
                        <p className="fs-2 fw-medium mt-4">Oops! Page not found</p>
                        <p className="mt-4 mb-5">
                            Your account may be disabled or not found.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotFound