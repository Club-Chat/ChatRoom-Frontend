import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import {
  AuthButton,
  AuthCard,
  AuthFooterLink,
  AuthInput,
  AuthLayout,
  AuthTextLink,
} from "../components/auth/AuthForm";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginUser({ email, password });

      localStorage.setItem("auth", "true");
      navigate("/");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <AuthLayout>
      <AuthCard title="Login" subtitle="to get started" onSubmit={handleLogin}>
        <AuthInput
          type="email"
          placeholder="itsnaeemanjum@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-1">
          <AuthTextLink to="/forgot-password">Forgot Password?</AuthTextLink>
        </div>

        <AuthButton>Continue</AuthButton>

        <AuthFooterLink text="New User?" linkText="Register" to="/register" />
      </AuthCard>
    </AuthLayout>
  );
}

export default Login;
