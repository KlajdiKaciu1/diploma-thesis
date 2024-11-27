import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function RegisteredStudents() {
    const { degreeId } = useParams();  
    const [registeredStudents, setRegisteredStudents] = useState([]);

    useEffect(() => {
        const fetchRegisteredStudents = async () => {
            try {
                const response = await axios.get(`/professor/registered-students/${degreeId}`);
                setRegisteredStudents(response.data);
            } catch (error) {
                console.error('Failed to fetch registered students:', error);
            }
        };

        fetchRegisteredStudents();
    }, [degreeId]);

    return (
        <div className="container mx-auto p-8 bg-white shadow-2xl rounded-lg">
            <h2 className="text-4xl font-bold mb-8 text-gray-900 text-center border-b-2 pb-4">
                Registered Students
            </h2>
            {registeredStudents.length > 0 ? (
                <ul className="space-y-4">
                    {registeredStudents.map(student => (
                        <li 
                            key={student._id} 
                            className="bg-gray-100 p-4 rounded-lg shadow-md text-gray-800 text-lg hover:bg-gray-200 transition duration-300 ease-in-out"
                        >
                            {student.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-600 text-lg mt-8">
                    No students have registered for this degree yet.
                </p>
            )}
        </div>
    );
}
