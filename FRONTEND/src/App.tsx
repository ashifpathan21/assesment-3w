import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

import { useEffect, useState } from "react";
import { userAPI } from "./apis/services/user";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await userAPI.getProfile();
        if (response.data.success) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error: any) {
        setIsValid(false);
        localStorage.removeItem('token');
      }
    };

    validateToken();
  }, [token]);

  if (isValid === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isValid) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  const content = (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/auth" element={localStorage.getItem('token') ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  if (isAuthPage) {
    return content;
  }

  return <Layout>{content}</Layout>;
};

export default App;
