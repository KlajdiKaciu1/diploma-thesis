import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import StudentNav from "./StudentNav";
import axios from "axios";

export default function StudentDashboard() {
    const [studentDetails, setStudentDetails] = useState(null);
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        if (user && user._id) {
            axios.get(`/student/student-details/${user._id}`)
                .then(response => {
                    setStudentDetails(response.data);
                })
                .catch(error => {
                    console.error('Error fetching student details:', error);
                });
        }
    }, [user]);

    return (
        <div className="bg-gradient-to-b from-blue-50 to-indigo-100 min-h-screen mt-5">
            <StudentNav />
            <section className="py-10 sm:py-16 lg:py-8">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                        <div>
                            {studentDetails ? (
                                <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center text-lg">
                                        <span className="mr-4 font-medium text-gray-700">Bachelor degree:</span>
                                        <span className="text-gray-900">{studentDetails.bachelorDegree}</span>
                                    </div>
                                    <div className="flex items-center text-lg">
                                        <span className="mr-4 font-medium text-gray-700">English level:</span>
                                        <span className="text-gray-900">{studentDetails.englishLevel}</span>
                                    </div>
                                    <div className="flex items-center text-lg">
                                        <span className="mr-4 font-medium text-gray-700">Average grade:</span>
                                        <span className="text-gray-900">{studentDetails.avgGrade}</span>
                                    </div>
                                    <div className="flex items-center text-lg">
                                        <span className="mr-4 font-medium text-gray-700">Computer Eng Points:</span>
                                        <span className="text-gray-900">{studentDetails.pointsCompEng}</span>
                                    </div>
                                    <div className="flex items-center text-lg">
                                        <span className="mr-4 font-medium text-gray-700">Electronics Eng Points:</span>
                                        <span className="text-gray-900">{studentDetails.pointsElecEng}</span>
                                    </div>
                                </div>
                            </div>
                            
                            ) : (
                                <div className="mt-8 text-gray-500">Loading student details...</div>
                            )}
                        </div>

                        <div>
                            <img className="w-full rounded-lg shadow-lg" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/hero-img.png" alt="Student" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
