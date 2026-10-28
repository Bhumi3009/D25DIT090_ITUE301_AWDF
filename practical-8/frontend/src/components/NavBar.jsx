import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    useEffect(() => {
    const checkLogin = () => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("login", checkLogin);
    window.addEventListener("storage", checkLogin);

    return () => {
        window.removeEventListener("login", checkLogin);
        window.removeEventListener("storage", checkLogin);
    };
}, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h2 className="logo">MT.</h2>

            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>

                <li>
                    <Link to="/login">Login</Link>
                </li>

                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                <li>
                    <Link to="/projects">Projects</Link>
                </li>

                <li>
                    <Link to="/tasks">Tasks</Link>
                </li>

                <li>
                    <Link to="/contact">Contact</Link>
                </li>

                {isLoggedIn && (
                    <li>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;