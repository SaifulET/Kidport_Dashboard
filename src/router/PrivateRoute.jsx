import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ensureSession } from "../lib/api";

const PrivateRoute = () => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    ensureSession().then((ok) => {
      if (!cancelled) setStatus(ok ? "authed" : "guest");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">
        Loading
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
