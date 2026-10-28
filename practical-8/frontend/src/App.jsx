import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoadingFallback from "./components/LoadingFallback";
import { lazyWithDelay } from "./utils/lazyWithDelay";

// Route-based code splitting using React.lazy()
const Home = lazy(() => import("./pages/Home"));

// Supplementary Problem 2: Route lazy loading with 300ms minimum delay fallback to prevent loading flicker
const Projects = lazyWithDelay(() => import("./pages/Projects"), 300);
const Contact = lazyWithDelay(() => import("./pages/Contact"), 300);

const Tasks = lazy(() => import("./pages/Tasks"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
    return (
        <>
            <NavBar />

            {/* Suspense boundary with meaningful fallback UI */}
            <Suspense fallback={<LoadingFallback message="Loading page components..." />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
