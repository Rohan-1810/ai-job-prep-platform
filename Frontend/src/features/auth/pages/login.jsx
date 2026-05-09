import React from 'react'
import "../auth.form.scss"
import { useNavigate,Link} from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

 const Login = () => {
    const {loading, handleLogin } = useAuth();

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await handleLogin({ email, password });
            if (data && data.user) {
                navigate('/');
            }
        } catch (err) {
            console.log(err);
        }
    }

    if(loading){
      return(<main><h1>Loading..........</h1></main>)
    }
  return (
   <main>
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input onChange={(e)=>{setEmail(e.target.value)}} type="email" id="email" placeholder='Enter your email' />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input onChange={(e)=>{setPassword(e.target.value)}} type="password" id="password" placeholder='Enter your password' />
        </div>
        <button className='button primary-button' type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
   </main>
  )
}
export default Login