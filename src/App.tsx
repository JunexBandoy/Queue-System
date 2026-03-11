// src/App.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout } from "./module/Layout/Layout";
import { getUser } from "./Auth/Auth";
import LoginForm from "./module/Layout/Login";

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      navigate("/login"); // redirect to login if not authenticated
    }
  }, [navigate]);

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return authenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <LoginForm />
  );
};

export default App;
