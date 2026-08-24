import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../lib/api";

const PrivateRoute = () => {
    const user = localStorage.getItem("user");
    const accessToken = getAccessToken();
    
    if (!user || !accessToken) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
