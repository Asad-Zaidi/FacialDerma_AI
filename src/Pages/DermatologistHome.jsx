import { useLocation } from "react-router-dom";

const DermatologistHome = () => {
    const location = useLocation();
    console.log("You are at:", location.pathname);

    return (
        <div>
            <h1>Welcome, Dermatologist!</h1>
        </div>
    );
};

export default DermatologistHome;