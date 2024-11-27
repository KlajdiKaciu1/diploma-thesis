import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../UserContext";

export default function RankingTable() {
    const { degreeId } = useParams();  
    const { user } = useContext(UserContext); 
    const [students, setStudents] = useState([]);
    const [accStudents, setAccStudents] = useState([]);
    const [degreeSlots, setDegreeSlots] = useState(0);
    const [degree, setDegree] = useState({});
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`/student/registered-students/${degreeId}`);
                const { appliedStudents, degreeSlots, degree, acceptedStudents } = response.data;
                console.log(degree); 
                setStudents(appliedStudents);
                setDegreeSlots(degreeSlots);
                setDegree(degree);
                setAccStudents(acceptedStudents);

                // Check if the current user's ID is in the accepted students list
                const userAccepted = acceptedStudents.some(accStudent => accStudent.studentId._id === user._id);
                setIsAccepted(userAccepted);

            } catch (error) {
                console.error('Failed to fetch students:', error);
            }
        };

        fetchStudents();
    }, [degreeId, user._id]);

    const handleRegister = async () => {
        try {
            await axios.post(`/student/register/${degreeId}`, { studentId: user._id });
            alert('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center border-b pb-4">
                Student Rankings
            </h2>
            <div className="text-xl font-semibold text-gray-700 text-center mb-6">
                 {degree && degree.title ? `Degree: ${degree.title}` : ''}
           </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="py-4 px-6 text-center font-bold text-gray-700 uppercase border-b border-gray-300">
                                Rank
                            </th>
                            <th className="py-4 px-6 text-left font-bold text-gray-700 uppercase border-b border-gray-300">
                                Student Name
                            </th>
                            <th className="py-4 px-6 text-center font-bold text-gray-700 uppercase border-b border-gray-300">
                                Points
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr
                                key={student.studentId._id}
                                className={`${
                                    index < degreeSlots
                                        ? 'bg-green-300'
                                        : 'bg-red-300'
                                } hover:bg-gray-100 transition duration-200`}
                            >
                                <td className="py-4 px-6 text-center border-b border-gray-300 font-medium text-gray-800">
                                    {index + 1}
                                </td>
                                <td className="py-4 px-6 border-b border-gray-300 font-medium text-gray-800">
                                    {student.studentId.name}
                                </td>
                                <td className="py-4 px-6 text-center border-b border-gray-300 font-medium text-gray-800">
                                    {degree.field === 'Computer Engineering' ? student.pointsCompEng : student.pointsElecEng}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 text-center">
                {isAccepted ? (
                    <div className="text-green-700 font-semibold">
                        You have been accepted!{' '}
                        <button
                            onClick={handleRegister}
                            className="ml-4 bg-green-600 text-white px-4 py-2 rounded shadow"
                        >
                            Register
                        </button>
                    </div>
                ) : (
                    <div className="text-red-700 font-semibold">
                        You have been declined!
                    </div>
                )}
            </div>
        </div>
    );
}

