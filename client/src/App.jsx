import './App.css'
import {Route, Routes} from "react-router-dom";
import { UserContextProvider } from './UserContext'; 
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './adminPages/AdminDashboard';
import AdminProfile from './adminPages/AdminProfile';
import CreateProfessor from './adminPages/CreateProfessor';
import ManageProfessors from './adminPages/ManageProfessors';
import DegreeForm from './adminPages/DegreeForm';
import ProfessorDashboard from './professorPages/ProfessorDashboard';
import ProfessorProfile from './professorPages/ProfessorProfile';
import CreateStudent from './professorPages/CreateStudent';
import StudentDetails from './professorPages/StudentDetails';
import StudentDetailsForm from './professorPages/StudentDetailsForm';
import RegisteredStudents from './professorPages/RegisteredStudents';
import StudentDashboard from './studentPages/StudentDashboard';
import StudentProfile from './studentPages/StudentProfile';
import Apply from './studentPages/Apply';
import DegreeInfo from './studentPages/DegreeInfo';
import Ranking from './studentPages/Ranking';
import RankingTable from './studentPages/RankingTable';
import Layout from './Layout';
import axios from "axios";



axios.defaults.baseURL='http://localhost:3000';
axios.defaults.withCredentials=true; 
function App() {

return (
  <UserContextProvider>
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />}/> 
            <Route path="/login" element={<LoginPage />}/> 
            <Route path="/signup" element={<SignupPage />}/> 
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/:id" element={<DegreeForm />} />
            <Route path="/admin/new-degree" element={<DegreeForm />} />
            <Route path="/admin/account" element={<AdminProfile />}/>
            <Route path="/admin/create-professors" element={<CreateProfessor />}/>
            <Route path="/admin/manage-professors" element={<ManageProfessors />}/>
            <Route path="/professor" element={<ProfessorDashboard />} />
            <Route path="/professor/account" element={<ProfessorProfile />} />
            <Route path="/professor/create-student" element={<CreateStudent />} />
            <Route path="/professor/student-details" element={<StudentDetails />} />
            <Route path="/professor/student-details/:id" element={<StudentDetailsForm />} />
            <Route path="/professor/degree/:degreeId" element={<RegisteredStudents/>} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/account" element={<StudentProfile />} />
            <Route path="/student/apply" element={<Apply />} />
            <Route path="/student/degree/:id" element={<DegreeInfo />} />
            <Route path="/student/ranking" element={<Ranking />} />
            <Route path="/student/ranking/:degreeId" element={<RankingTable />} />
        </Route>
     </Routes>
  </UserContextProvider>
  )
}

export default App
