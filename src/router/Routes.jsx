import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/Main/Main";
import PrivateRoute from "./PrivateRoute";

const SignIn = lazy(() => import("../Pages/Auth/SignIn/SignIn"));
const ForgatePassword = lazy(() => import("../Pages/Auth/ForgatePassword/ForgatePassword"));
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const VerifyCode = lazy(() => import("../Pages/Auth/VerifyCode/VerifyCode"));
const NewPass = lazy(() => import("../Pages/Auth/NewPass/NewPass"));
const UserManagement = lazy(() => import("../Pages/UserManagement/UserManagement"));
const UserDetails = lazy(() => import("../Pages/UserManagement/UserDetails"));
const EventDetails = lazy(() => import("../Pages/UserManagement/EventDetails"));
const ProtocolManager = lazy(() => import("../Pages/ProtocolManager/ProtocolManager"));
const CreateProtocol = lazy(() => import("../Pages/ProtocolManager/CreateProtocol"));
const ExerciseLibrary = lazy(() => import("../Pages/ExerciseLibrary/ExerciseLibrary"));
const AddExercise = lazy(() => import("../Pages/ExerciseLibrary/AddExercise"));
const VideoManager = lazy(() => import("../Pages/VideoManager/VideoManager"));
const UploadVideo = lazy(() => import("../Pages/VideoManager/UploadVideo"));
const SubscriptionManagement = lazy(() => import("../Pages/SubscriptionManagement/SubscriptionManagement"));
const Settings = lazy(() => import("../Pages/Settings/Settings"));
const ChildrenPage = lazy(() => import("../Pages/Children/Children"));
const AIMonitoringPage = lazy(() => import("../Pages/AIMonitoring/AIMonitoring"));
const ObservationsPage = lazy(() => {
  const startedAt = performance.now();
  const clickedAt = Number(sessionStorage.getItem('observationClickAt') || window.__observationClickAt || 0);
    return import("../Pages/Observations/Observations").then((module) => {
        return module;
  });
});
const ParentNotifications = lazy(() => import("../Pages/Notifications/ParentNotifications"));
const DaycareNotifications = lazy(() => import("../Pages/Notifications/DaycareNotifications"));
const SupportPage = lazy(() => import("../Pages/Support/Support"));
const DomainManagement = lazy(() => import("../Pages/Domains/DomainManagement"));

const routeLoader = (
  <div className="min-h-screen bg-white flex items-center justify-center text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">
    Loading
  </div>
);

const page = (element) => (
  <Suspense fallback={routeLoader}>
    {element}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: page(<SignIn />),
  },
  {
    path: "/forgate-password",
    element: page(<ForgatePassword />),
  },
  {
    path: "/verify-code",
    element: page(<VerifyCode />),
  },
  {
    path: "/new-password",
    element: page(<NewPass />),
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: page(<Dashboard />) },
          { path: "/dashboard", element: page(<Dashboard />) },
          { path: "/domains", element: page(<DomainManagement />) },
          { path: "/children", element: page(<ChildrenPage />) },
          { path: "/observations", element: page(<ObservationsPage />) },
          { path: "/ai-monitoring", element: page(<AIMonitoringPage />) },
          { path: "/protocol-manager", element: page(<ProtocolManager />) },
          { path: "/user-management", element: page(<UserManagement />) },
          { path: "/user-management/:id", element: page(<UserDetails />) },
          { path: "/event-details/:id", element: page(<EventDetails />) },
          { path: "/create-protocol", element: page(<CreateProtocol />) },
          { path: "/exercise-library", element: page(<ExerciseLibrary />) },
          { path: "/add-exercise", element: page(<AddExercise />) },
          { path: "/video-manager", element: page(<VideoManager />) },
          { path: "/upload-video", element: page(<UploadVideo />) },
          { path: "/subscription", element: page(<SubscriptionManagement />) },
          { path: "/settings", element: page(<Settings />) },
          { path: "/support", element: page(<SupportPage />) },
          { path: "/notifications", element: page(<ParentNotifications />) },
          { path: "/daycare-notifications", element: page(<DaycareNotifications />) },
        ],
      },
    ],
  },
]);
