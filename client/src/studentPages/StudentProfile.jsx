import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import StudentNav from "./StudentNav";
import axios from "axios";


export default function ProfesorProfile() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);


    if (ready && !user && !redirect) {
        return <Navigate to="/login" />;
    }

    async function logout() {
        try {
            await axios.post('/student/logout');
            setUser(null);
            setRedirect('/'); 
        } catch (error) {
            console.error('Logout failed', error);
          
        }
    }


    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            <StudentNav />
            <div className="text-center max-w-lg mx-auto">
                Hello student, Logged in as {user?.name} ({user?.email})<br />
                <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
            </div>
        </div>
    );
}
