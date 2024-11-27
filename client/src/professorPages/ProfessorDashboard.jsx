import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProfNav from "./ProfNav";

export default function ProfessorDashboard() {
    const [degrees, setDegrees] = useState([]);
    useEffect(() => {
        axios.get('/professor/degrees').then(response => {
            setDegrees(response.data);
        });
    }, []);

    return (
    <div>
        <ProfNav />
        <div className=" mt-8 grid gap-6 gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {degrees.length > 0 && degrees.map(degree => (
                <Link key={degree.id} to={'/professor/degree/'+degree._id}>
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