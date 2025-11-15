import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import UserProfile from "./Pages/UserProfile";
import DermatologistProfile from "./Pages/DermatologistProfile";
import Analysis from "./Pages/Analysis";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
// import ForgetPassword from "./Pages/ForgetPassword";
import Dermatologist from "./Pages/DermatologistHome";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./Routes/PrivateRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/Profile" element={<UserProfile />}/>
                    {/* <Route path="/forget-password" element={<ForgetPassword />} /> */}

                    {/* <Route path="/Profile" element={
                        <PrivateRoute>
                            <UserProfile />
                        </PrivateRoute>
                    } /> */}
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
                    } />
                </Routes>
                <ToastContainer position="top-center" autoClose={2000} />

            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRouter;

