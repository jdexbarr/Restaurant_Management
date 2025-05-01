import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext'; // 🔥 importa el contexto
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext); // 🔥 obtenemos las funciones para actualizar AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/clients/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login Response:', data); // 🔥 Ver en consola qué viene realmente

        if (data && data.user && data.token) {
          // 🔥 Guardar en AuthContext
          setUser(data.user);
          setToken(data.token);

          // 🔥 Guardar también en localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);

          // ✅ Redirigir al home
          navigate('/');
        } else {
          setErrorMsg('Invalid server response.');
        }
      } else {
        setErrorMsg('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMsg('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMsg && <div className="login-error">{errorMsg}</div>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;




  