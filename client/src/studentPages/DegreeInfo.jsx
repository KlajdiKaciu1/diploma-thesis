import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext"; 
import PhotoCarousel from "../PhotoCarousel";

export default function DegreeInfo() {
  const [degree, setDegree] = useState(null);
  const { id } = useParams();
  const { user } = useContext(UserContext); 

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/student/degrees/${id}`).then((response) => {
      setDegree(response.data);
    });
  }, [id]);

  const applyForDegree = async () => {
    try {
      await axios.post(`/student/degrees/apply`, {
        degreeId: id,
        studentId: user._id,
      });
      alert("You have successfully applied for this degree!");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Failed to apply for this degree.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-8 mt-5">
      <div className="w-full text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight animate-fade-in-down">
          Degree Information
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl space-y-8 lg:space-y-0 lg:space-x-12 bg-white p-10 rounded-lg shadow-2xl animate-fade-in-up">
        {degree ? (
          <>
            <div className="w-full lg:w-2/3 transform transition-transform duration-500 hover:scale-105">
              <PhotoCarousel photos={degree.photos} />
            </div>
            <div className="w-full lg:w-1/3 space-y-6">
              <h2 className="text-3xl font-semibold text-gray-800 leading-snug border-b-2 border-gray-300 pb-2">
                {degree.title}
              </h2>
              <p className="text-md text-gray-700 leading-relaxed max-h-64 overflow-auto">
                {degree.description}
              </p>
              <div className="flex justify-center mt-6">
                <button
                  onClick={applyForDegree}
                  className="w-11/12 px-6 py-4 bg-gray-800 text-white text-lg font-medium rounded-md shadow-lg hover:bg-gray-700 transform transition-transform duration-300 hover:scale-105"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 text-lg">Loading...</div>
        )}
      </div>
    </div>
  );
}




