import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom"; 
import StudentNav from "./StudentNav";

export default function Ranking() {
    const [degrees, setDegrees] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get(`/student/applied-degrees/${user._id}`)
            .then(response => {
                setDegrees(response.data);
            })
            .catch(error => {
                console.error('Error fetching student degrees:', error);
            });
    }, [user._id]);

    return (
        <div>
        <StudentNav />
        <div className=" mt-8 grid gap-6 gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {degrees.length > 0 && degrees.map(degree => (
                <Link key={degree.id} to={`/student/ranking/${degree._id}`}>
                    <div className="bg-gray-500 rounded-2xl flex mb-2">
                        {degree.photos?.[0] && (
                        <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:3000/'+ degree.photos?.[0]} alt="" />
                        )}
                     </div>
                     <h2 className="font-bold">{degree.title}</h2>
                    <h3 className="text-sm leading-4 text-gray-800">{degree.field}</h3>
               </Link>
            ))}
        </div>
     </div>
    );
}

