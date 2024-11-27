import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";


export default function Header() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const getProfilePath = async () => {
    if (user && user.role) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/account');
          break;
        case 'professor':
          navigate('/professor/account');
          break;
        case 'student':
          navigate('/student/account');
          break;
        default:
          navigate('/');
          break;
      }
    } else {
      navigate('/login'); 
    }
  };


  return (
    <header className="bg-white lg:py-3">
      <div>
        <nav className="relative flex items-center justify-between h-10 bg-white lg:rounded-md lg:h-4">
          <div className="flex-shrink-0">
            <button onClick={() => navigate('/')} className=" bg-transparent hover:text-blue-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
              <span className="font-bold text-xl">University portal</span>
            </button>
          </div>
          <div className="hidden ml-10 lg:flex lg:items-center lg:mr-auto lg:space-x-10">
          <a href="https://fti.edu.al/" title="" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600">Our school</a>
            <a href="#" title="" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600">Features</a>
            <a href="#" title="" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600">Events</a>
            <a href="#" title="" className="text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600">Contacts</a>
          </div>
          <div className="hidden lg:flex lg:items-center lg:space-x-10">
            <button onClick={getProfilePath} className=" bg-transparent hover:text-blue-500 flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              {!!user && (
                <div>
                  {user.name}
                </div>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}


