import { Link, useNavigate } from 'react-router-dom'; 
import { useState, useEffect, useContext } from 'react'; 
import './Navbar.css'; 
import { CartContext } from './CartContext'; 
import { AuthContext } from '../components/AuthContext'; // 🔥 importamos AuthContext 

function Navbar() {   
  const navigate = useNavigate();   
  const { user, setUser, setToken } = useContext(AuthContext);   
  const { cart } = useContext(CartContext);    

  const [cartCount, setCartCount] = useState(0);   
  const [shake, setShake] = useState(false);   
  const [showProfileMenu, setShowProfileMenu] = useState(false);    

  useEffect(() => {     
    const newCount = cart.reduce((sum, item) => sum + item.quantity, 0);     
    setCartCount(prev => {       
      if (prev !== newCount) {         
        setShake(true);         
        setTimeout(() => setShake(false), 500);       
      }       
      return newCount;     
    });   
  }, [cart]);    

  const handleLogout = () => {     
    localStorage.removeItem('user');     
    localStorage.removeItem('token');     
    setUser(null);     
    setToken(null);     
    navigate('/login');   
  };    

  const toggleProfileMenu = () => {     
    setShowProfileMenu(prev => !prev);   
  };    

  return (     
    <nav className="navbar">       
      <div className="navbar-links-wrapper">         
        {/* Título "Fineza" en la parte izquierda de la navbar */}         
        <div className="navbar-title">Fineza</div>  {/* Título agregado aquí */}

        <div className="navbar-links">           
          <Link to="/">Home</Link>           
          <Link to="/menu">Menu</Link>           
          <Link to="/booking">Booking</Link>                      

          <Link to="/cart">             
            <span className={`cart-icon ${shake ? 'shake' : ''}`}>🛒 Cart ({cartCount})</span>           
          </Link>            

          {/* 🔥 Aquí agregamos MyReservations directamente en la navbar */}           
          {user && (             
            <Link to="/myreservations">My Reservations</Link>           
          )}            

          {/* 🔥 Links de Admin solo para Admins */}           
          {user && user.role === 'ADMIN' && (             
            <>               
              <Link to="/admin/reservations">Admin</Link>               
              <Link to="/admin/menu">Manage Menu</Link>               
              <Link to="/admin/tables">Manage Tables</Link>               
              <Link to="/admin/orders" className="admin-link pulse">🧾 Manage Orders</Link>             
            </>           
          )}            

          {/* 🔥 Mostrar login/signup solo si no está logueado */}           
          {!user && <Link to="/login">Login</Link>}           
          {!user && <Link to="/signup">Sign Up</Link>}         
        </div>          

        {user && (           
          <div className="profile-menu-wrapper">             
            <div className="profile-avatar" onClick={toggleProfileMenu}>👤</div>             
            {showProfileMenu && (               
              <div className="profile-dropdown">                 
                <Link to="/profile">Profile</Link>                 
                {/* 🔥 Eliminamos MyReservations de aquí */}                 
                <button onClick={handleLogout} className="logout-button">Logout</button>               
              </div>             
            )}           
          </div>         
        )}       
      </div>     
    </nav>   
  ); 
}

export default Navbar;









