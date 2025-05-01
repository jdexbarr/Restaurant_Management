import Footer from './Footer';
import { Link } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';

function Home() {
  // Estado para controlar el índice de la imagen actual en el carrusel
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = ['https://i.pinimg.com/736x/1e/36/77/1e36776706000f9c9c9736bf7b2486fc.jpg', 'https://i.pinimg.com/736x/13/1f/fe/131ffe17fbaca82da95dd14dff884e17.jpg', 'https://i.pinimg.com/736x/6a/88/32/6a8832d29a911b320f9c68af86f8e134.jpg',
    'https://i.pinimg.com/736x/68/6c/1c/686c1c731d606d0ddc05a2955b1852c5.jpg','https://i.pinimg.com/736x/54/1e/43/541e4347b37779d800449d29964d74a3.jpg', 'https://i.pinimg.com/736x/6c/2e/17/6c2e1736ce6637346935fb7220ddc4f1.jpg','https://i.pinimg.com/736x/bf/49/35/bf49357ec9f0bdd1475cfb6f49402cd4.jpg', 'https://i.pinimg.com/736x/69/f6/6a/69f66a1db143f87267a7298b477f0081.jpg'
  ]; // Las rutas de las imágenes
  const totalImages = images.length;

  // Función para mover a la siguiente imagen
  const moveToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  // Función para mover a la imagen anterior
  const moveToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalImages) % totalImages
    );
  };

  // Cambiar automáticamente la imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(moveToNext, 3000); // Cambia cada 3 segundos
    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

  return (
    <div className="home-container">
      <main className="home-main">
        <section className="hero-section">
          <div className="hero-box">
            <h1 className="hero-title">Need a Reservation?</h1>
            <p className="hero-subtitle">Here, you can choose your seat at our restaurant</p>
            <Link to="/booking">
              <button className="primary-button1">Book Here</button>
            </Link>
          </div>
        </section>



        <section className="join-section">
          <h2>Join Us!</h2>
          <div className="join-buttons">
            <Link to="/login">
              <button className="outline-button">Log In</button>
            </Link>
            <Link to="/signup">
              <button className="outline-button">Sign Up</button>
            </Link>
          </div>
        </section>

        <section className="menu-section">
          <h2>Menu</h2>
          <div className="menu-container">
            {/* Carrusel dentro de la imagen, alineado a la izquierda */}
            <div className="menu-image">
              <div className="carousel">
                <div className="carousel-images">
                  <img
                    src={images[currentIndex]}
                    alt={`Dish ${currentIndex + 1}`}
                    className="carousel-image"
                  />
                </div>
              </div>
            </div>

            {/* Texto y botón a la derecha */}
            <div className="menu-text">
              <p>Delicious dishes for every taste!</p>
              <Link to="/menu">
                <button className="primary-button">See Menu</button>
              </Link>
            </div>
          </div>
        </section>

        {/* 🔔 Mantener los guidelines tal como pediste */}
        <div className="reservation-info-box">
          <h3>Reservation Guidelines</h3>
          <ul>
            <li>⏰ Available from 10:00 AM to 10:00 PM</li>
            <li>📅 You cannot book for past dates</li>
            <li>🪑 No double booking for the same table and time</li>
            <li>👥 Maximum 20 guests per reservation</li>
            <li>📍 Limited to 15 tables at the moment</li>
          </ul>
        </div>
        <section className="info-section">
          <h2>Restaurant Info</h2>
          <button className="info-button">Learn More</button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;











