import { FaCalendarAlt, FaClock, FaMobileAlt, FaChartLine } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to <span className="brand">KaryaKit</span></h1>
        <p className="tagline">Organize your day, boost your productivity — anywhere, anytime.</p>
        <p className="description">
          KaryaKit is your personal productivity companion — a sleek, easy-to-use daily scheduler
          designed to keep you focused and in control. Organize tasks, set priorities, and achieve
          your goals without the clutter.
        </p>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <FaCalendarAlt className="icon" />
          <h3>Plan Your Day</h3>
          <p>Set deadlines and priorities easily.</p>
        </div>
        <div className="feature-card">
          <FaClock className="icon" />
          <h3>Never Miss a Task</h3>
          <p>Get reminders on time.</p>
        </div>
        <div className="feature-card">
          <FaMobileAlt className="icon" />
          <h3>Access Anywhere</h3>
          <p>Cloud sync across all devices.</p>
        </div>
        <div className="feature-card">
          <FaChartLine className="icon" />
          <h3>Track Progress</h3>
          <p>Visual charts of completed tasks.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <blockquote>
          "KaryaKit helped me organize my college projects effortlessly!"  
          <span>— Priya S.</span>
        </blockquote>
        
        <blockquote>
          "KaryaKit helped me organise my schedule and assignments dates and submissions i am very thankful"  
          <span>— Arvind B .</span>
        </blockquote>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-linkedin"></i></a>
        </div>
        <p>© {new Date().getFullYear()} KaryaKit. All rights reserved.</p>
      </footer>
    </div>
  );
}
