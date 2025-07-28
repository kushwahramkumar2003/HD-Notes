import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../state/userAtom";
import api from "../api/api";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useSetRecoilState(userState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleTokenAuth = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setError("No token provided");
          setLoading(false);

          setTimeout(() => navigate("/signin"), 2000);
          return;
        }

        localStorage.setItem("token", token);

        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data.user || response.data;

        console.log("user data", userData);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

        navigate("/");
      } catch (err: any) {
        console.error("Auth error:", err);
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Authentication failed. Please try again.";

        setError(errorMessage);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);

        setTimeout(() => navigate("/signin"), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleTokenAuth();
  }, [searchParams, navigate, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authenticating...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your credentials.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p>{error}</p>
          </div>
          <p className="text-gray-600">Redirecting to sign in page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Auth;
