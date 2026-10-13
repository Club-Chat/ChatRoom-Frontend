import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";

function App() {
  const isAuth = localStorage.getItem("auth") === "true";

  return (
    <Routes>
      <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/chat" element={isAuth ? <ChatPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
