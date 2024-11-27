import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function StudentDetailsForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bachelorDegree, setBachelorDegree] = useState('');
    const [englishLevel, setEnglishLevel] = useState('');
    const [avgGrade, setAvgGrade] = useState('');
    const [pointsCompEng] = useState(0);
    const [pointsElecEng] = useState(0);
    const [isExisting, setIsExisting] = useState(false);

    useEffect(() => {
        if (!id) return;
      
        axios.get(`/professor/student-details/${id}`)
          .then(response => {
            const data = response.data;
            setBachelorDegree(data.bachelorDegree);
            setEnglishLevel(data.englishLevel);
            setAvgGrade(data.avgGrade);
            setIsExisting(true);
          })
          .catch(error => {
            if (error.response) {
              console.error('Error response:', error.response);
              if (error.response.status === 404) {
                setIsExisting(false);
              }
            } else {
              console.error('Error message:', error.message);
            }
          });
      }, [id]);
      
    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isExisting ? 'put' : 'post';
        const url = isExisting ? `/professor/student-details/${id}` : `/professor/student-details/${id}`;

        const details = {
            bachelorDegree,
            englishLevel,
            avgGrade,
            pointsCompEng,
            pointsElecEng
        };

        axios[method](url, details)
            .then(response => {
                console.log('Details saved:', response.data);
                alert('Details saved!');
                navigate('/professor');
            })
            .catch(error => {
                console.error('Error saving details:', error);
            });
    };

    function inputHeader(text) {
        return (
            <h2 className="text-xl font-bold text-blue-600 mb-2">{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-700 text-sm mb-4">{text}</p>
        );
    }

    function preInput(header, description) {
        return (
            <div className="mb-6">
                {inputHeader(header)}
                {inputDescription(description)}
            </div>
        );
    }

    return (
        <div className="p-8 w-full max-w-7xl min-h-[500px] mx-auto bg-gradient-to-r from-purple-200 via-blue-100 to-white shadow-lg rounded-lg border border-gray-300 mt-5">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
            {isExisting ? 'Update Student Details' : 'Add Student Details'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                {preInput('Bachelor Degree', 'Select the student\'s bachelor degree')}
                <select
                    name="bachelorDegree"
                    value={bachelorDegree}
                    onChange={ev => setBachelorDegree(ev.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
                    required
                >
                    <option value="">Select a degree</option>
                    <option value="Bachelor Computer Engineering">Bachelor in Computer Engineering</option>
                    <option value="Bachelor Electronic Engineering">Bachelor in Electronics Engineering</option>
                    <option value="Bachelor Telecommunication Engineering">Bachelor in Telecommunication Engineering</option>
                </select>
            </div>
    
            <div>
                {preInput('English Level', 'Select the student\'s English proficiency level')}
                <select
                    name="englishLevel"
                    value={englishLevel}
                    onChange={ev => setEnglishLevel(ev.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
                    required
                >
                    <option value="">Select an English level</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                </select>
            </div>
    
            <div>
                {preInput('Average Grade', 'Enter the student\'s average grade')}
                <input
                    type="number"
                    name="avgGrade"
                    value={avgGrade}
                    onChange={ev => setAvgGrade(ev.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out w-full"
            >
                {isExisting ? 'Update Details' : 'Submit Details'}
            </button>
        </form>
    </div>
    );
}
