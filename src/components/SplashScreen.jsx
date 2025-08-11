import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import "./SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // start fade out
      setTimeout(onFinish, 500); // wait for fade to finish
    }, 1500); // show for 1.5 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <img src={logo} alt="KaryaKit Logo" className="splash-logo" />
      <h1 className="splash-title">KaryaKit</h1>
      <p className="splash-tagline">Plan. Act. Achieve.</p>
    </div>
  );
}
