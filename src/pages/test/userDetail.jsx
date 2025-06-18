import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:3001/users"; 

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_URL}/${id}`);
                const result = await response.json();
                if (result) {
                    setUser(result[0].payload.data[0]);
                    console.log(result)
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, [id]);

    if (!user) return <p>Loading user data...</p>;

    return (
        <div>
            <h2>User Details</h2>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
        </div>
    );
};

export default UserDetail;
