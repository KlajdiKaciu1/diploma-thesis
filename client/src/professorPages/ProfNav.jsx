import { Link, useLocation } from "react-router-dom";

export default function ProfNav() {
    const { pathname } = useLocation();
    let subpage = pathname.split('/')[2];

    if (subpage === undefined) {
        subpage = 'dashboard';
    }

    function linkClasses(type = null) {
        let classes = 'relative inline-flex items-center gap-2 py-3 px-8 rounded-full font-semibold text-sm transition-all duration-300 ease-out';

        if (type === subpage) {
            classes += ' bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg transform scale-105';
        } else {
            classes += ' bg-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:text-white hover:shadow-lg hover:scale-105';
        }

        return classes;
    }

    return (
        <nav className="w-full flex justify-center mt-8 gap-4 mb-8">
            <Link className={linkClasses('dashboard')} to="/professor">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Dashboard
            </Link>
            <Link className={linkClasses('create-student')} to="/professor/create-student">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
                Create student
            </Link>
            <Link className={linkClasses('student-details')} to="/professor/student-details">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
                Add student details
            </Link>
        </nav>
    );
}