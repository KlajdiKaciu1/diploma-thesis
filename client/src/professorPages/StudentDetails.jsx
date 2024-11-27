import ProfNav from "./ProfNav";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function StudentDetails() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios.get('/professor/students')
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mt-5">
            <ProfNav />
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="max-w-2xl mx-auto text-left sm:text-center">
                    <h2 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl lg:leading-tight">
                        Student Directory
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Explore the list of students and manage their details.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 mt-12 sm:mt-16 xl:mt-24 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 xl:gap-16">
                    {students.length > 0 ? (
                        students.map(student => (
                            <div key={student._id} className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:scale-105">
                                <div className="py-10 px-10">
                                    <Link
                                        to={`/professor/student-details/${student._id}`}
                                        className="text-2xl font-semibold text-gray-800 hover:text-fuchsia-600"
                                    >
                                        {student.name}
                                    </Link>
                                    <p className="mt-4 text-base text-gray-500">
                                        {student.email}
                                    </p>
                                    <p className="mt-4 text-base text-gray-500">
                                        Click to add details about {student.name}.
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-800 text-2xl">
                            No students found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


