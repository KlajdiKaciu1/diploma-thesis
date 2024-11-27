import AdminNav from "./AdminNav";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [degrees, setDegrees] = useState([]);

  useEffect(() => {
    axios.get('/admin/degrees')
      .then(({ data }) => {
        setDegrees(data);
      })
      .catch(error => {
        console.error("Error fetching degrees:", error);
      });
  }, []);
  
  function deleteDegree(degreeId) {
    axios.delete(`/admin/degrees/${degreeId}`)
      .then(() => {
        setDegrees(degrees.filter(degree => degree._id !== degreeId));
      })
      .catch(error => {
        console.error("Error deleting degree:", error);
      });
  }
  
  return (
    <div>
      <AdminNav />
      <div className="text-center">
        <br />
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-5 rounded-full" to={'/admin/new-degree'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new degree
        </Link>
      </div>
      <div className="mt-4">
        {degrees.map(degree => (
          <div key={degree._id}>    
            <Link
              to={'/admin/' + degree._id}
              className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mb-4"
            >
              <div className="flex w-32 h-32 bg-gray-300 shrink-0">
                {degree.photos?.length > 0 && (
                  <img className="w-full h-full object-cover" src={'http://localhost:3000/'+degree.photos[0]} alt="" />
                )}
              </div>
              <div>
                <h2 className="text-xl">{degree.title}</h2>
                <p className="text-sm mt-2">{degree.description}</p>
              </div>
            </Link>
            <button
              onClick={() => deleteDegree(degree._id)}
              className="inline-flex gap-2 py-2 px-6 rounded-full bg-primary hover:bg-blue-700 text-white mb-4"
            >
              Delete degree
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
