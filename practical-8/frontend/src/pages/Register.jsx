import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Registration successful");

            navigate("/login");
        } catch (error) {
            alert("Unable to connect to server");
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h1>Register</h1>
                <p className="register-subtitle">
                    Create an account to manage your tasks
                </p>

                <form onSubmit={handleRegister}>
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

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;