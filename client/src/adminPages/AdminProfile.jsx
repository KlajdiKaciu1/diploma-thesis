import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import axios from "axios";


export default function AdminProfile(){
    const [redirect,setRedirect]= useState(null);
    const {ready,user,setUser} = useContext(UserContext);
   
   
    if(ready && !user && !redirect){
        return <Navigate to={'/login'}></Navigate>
    }
    async function logout(){
        await axios.post('/admin/logout');
        setRedirect('/');
        setUser(null);
    }
    if(redirect){
        return <Navigate to={redirect} />
    }
    return(
        <div>
               <AdminNav />
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
        </div>
    );
}