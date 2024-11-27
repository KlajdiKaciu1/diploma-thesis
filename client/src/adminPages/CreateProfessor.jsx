import AdminNav from "./AdminNav";
import { useState, useContext } from 'react';
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

export default function CreateProfessor() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('professor');
  const [redirect, setRedirect] = useState(null);
  const { user } = useContext(UserContext);

  function inputHeader(text) {
    return (
      <h2 className="text-lg font-semibold mb-1 text-gray-700">{text}</h2> 
    );
  }

  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm mb-1">{text}</p> 
    );
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function registerButton() {
    try {
      await axios.post('/admin/professor', {
       name,
       email,
       password,
       role
      });
      alert('Professor registered!');
      setRedirect('/admin');
    } catch (error) {
      console.error('Error registering professor:', error);
      alert('Failed to register professor.');
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  from-blue-50 to-indigo-100 mt-5">
      <AdminNav />
      <div className="min-h-screen flex items-center justify-center -mt-16">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl">
          <div className="text-center text-2xl font-bold text-gray-800 mb-6">Professor Form</div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              {preInput('Name', 'Full name')}
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={ev => setName(ev.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
              />
              {preInput('Email', 'Write the email')}
              <input
                type="email"
                placeholder="email@fti.edu.al"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
              />
              {preInput('Password', 'Recommended to be 8 characters long')}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
              />
              <div className="mt-9"> 
                <button
                  onClick={registerButton}
                  className="bg-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                    />
                  </svg>
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


