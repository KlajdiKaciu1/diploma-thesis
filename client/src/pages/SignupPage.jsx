import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role] = useState('admin');

   async  function registerUser(ev) {
        ev.preventDefault();
    try{
        await axios.post('/register', {
            name,
            email,
            password,
            role
        });
        alert('Registration completed!');
    }catch(e)
    {
        alert('Registration failed!');
    }
}

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">SignUp</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="Name Surname" 
                           value={name} 
                           onChange={ev => setName(ev.target.value)} />
                    
                    <input type="email" placeholder="your@email.com"
                           value={email} 
                           onChange={ev => setEmail(ev.target.value)} />
                    
                    <input type="password" placeholder="password"
                           value={password} 
                           onChange={ev => setPassword(ev.target.value)} />
                    
                    <button className="primary">SignUp</button>
                    <div className="text-center py-2 text-gray-500">
                        Already have an account? {"\t"}
                        <Link className="underline text-black" to="/login">LogIn</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}