import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// import Home from "./Pages/Home";
import About from "./Pages/About";
import UserProfile from "./Pages/UserProfile";
import DermatologistProfile from "./Pages/DermatologistProfile";
import Analysis from "./Pages/Analysis";
import Auth from "./components/Auth";
import ForgotPassword from "./components/ForgotPassword";
import EmailVerification from "./components/EmailVerification";
import Dermatologist from "./Pages/DermatologistHome";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./Routes/PrivateRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SmartHome from "./components/SmartHome";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<SmartHome />} />
                    <Route path="/home" element={<SmartHome />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/Login" element={<Auth />} />
                    <Route path="/Signup" element={<Auth />} />
                    <Route path="/verify-email" element={<EmailVerification />} />
                    {/* <Route path="/Profile" element={<UserProfile />}/> */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* <Route path="/Profile" element={
                        <PrivateRoute>
                            <UserProfile />
                        </PrivateRoute>
                    } />
                    <Route path="/DProfile" element={
                        <PrivateRoute>
                            <DermatologistProfile />
                        </PrivateRoute>
                    } />
                    <Route path="/Analysis" element={
                        <PrivateRoute>
                            <Analysis />
                        </PrivateRoute>
                    } />
                    <Route path="/Dermatologist" element={
                        <PrivateRoute>
                            <Dermatologist />
                        </PrivateRoute>
                    } /> */}
                    {/* Patient profile */}
                    <Route path="/Profile" element={
                        <PrivateRoute roles={['patient']}>
                            <UserProfile />
                        </PrivateRoute>
                    } />

                    {/* Dermatologist profile */}
                    <Route path="/DProfile" element={
                        <PrivateRoute roles={['dermatologist']}>
                            <DermatologistProfile />
                        </PrivateRoute>
                    } />

                    {/* Dermatologist Home */}
                    <Route path="/Dermatologist" element={
                        <PrivateRoute roles={['dermatologist']}>
                            <Dermatologist />
                        </PrivateRoute>
                    } />

                    {/* Skin Analysis (patients only) */}
                    <Route path="/Analysis" element={
                        <PrivateRoute roles={['patient']}>
                            <Analysis />
                        </PrivateRoute>
                    } />

                </Routes>
                <ToastContainer position="top-center" autoClose={2000} />

            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRouter;

