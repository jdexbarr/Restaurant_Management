import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext'; 
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/SignUp';
import Menu from './components/Menu';
import Booking from './components/Booking';
import ProtectedRoute from './components/ProtectedRoute';
import AdminReservationsPage from './components/AdminReservationsPage';
import UserReservationsPage from './components/UserReservationsPage';
import EditReservationPage from './components/EditReservationPage';
import UserInterface from './components/UserInterface';
import CartPage from './components/CartPage';
import AdminMenuManager from './components/AdminMenuManager';
import AdminOrdersPage from './components/AdminOrdersPage';
import AdminTablesPage from './components/AdminTablesPage';


function App() {
  return (
    <AuthProvider> {}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute> {/*  login required */}
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute> {/* login required */}
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/editreservation/:id" element={<EditReservationPage />} />
          <Route
  path="/profile"
  element={
    <ProtectedRoute> {}
      <UserInterface />
    </ProtectedRoute>
  }
/>
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute requiredRole="ADMIN"> {/*  Admin */}
                <AdminMenuManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="ADMIN"> {/*  Admin */}
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tables"
            element={
              <ProtectedRoute requiredRole="ADMIN"> {/* Admin */}
                <AdminTablesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute requiredRole="ADMIN"> {/*  Admin */}
                <AdminReservationsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/myreservations"
            element={
              <ProtectedRoute> {/*  login required */}
                <UserReservationsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;






