import Navbar from "../../components/navbar/Navbar"

const About = () => {
    return (
        <>
            <Navbar about={true} />
            <div className="container mt-5">
                <h1 className="mb-4">About Internflow</h1>
                <p className="lead">
                    <strong>Internflow</strong> is a web-based information management system designed to manage internship tasks, submissions, and user roles efficiently.
                </p>
                <hr />
                <h4>Key Features</h4>
                <ul>
                    <li>📋 Task management for interns and supervisors</li>
                    <li>📁 Submission tracking and review system</li>
                    <li>🔐 Role-based access control</li>
                    <li>📊 User-friendly dashboard for both roles</li>
                </ul>

                <h4 className="mt-4">Technologies Used</h4>
                <ul>
                    <li>💻 <strong>Frontend:</strong> React + Bootstrap</li>
                    <li>⚙️ <strong>Backend:</strong> Express.js + MySQL</li>
                </ul>

                <h4 className="mt-4">Developer</h4>
                <p>
                    This project was developed by <strong>RM Arsy</strong> as a final project for Informatics Management at DISKOMINFO Palembang.
                    It aims to simplify internship supervision and communication between interns and administrators.
                </p>

                <p className="text-muted mt-5">
                    &copy; {new Date().getFullYear()} Internflow. All rights reserved.
                </p>
            </div>
        </>
    );
};

export default About;
