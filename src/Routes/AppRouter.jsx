import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Profile from "../Pages/Profile";
import Analysis from "../Pages/Analysis";
import Login from "../Pages/Login";
import PrivateRoute from "./PrivateRoutes";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />

                <Route path="/profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/analysis" element={
                    <PrivateRoute>
                        <Analysis />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
