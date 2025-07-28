import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import api from "../api/api";
import { userState } from "../state/userAtom";
import Logo from "../components/Logo";
import InputField from "../components/InputField";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import bg from "../assets/bg.svg";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();

  const handleGetOtp = async () => {
    if (!name || !dob || !email) {
      setError("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp-signup", { name, dob, email });
      setShowOtp(true);
    } catch (err: any) {
      setError(err.response?.data.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!otp) {
      setError("OTP required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp-signup", { email, otp });
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "https://notes.solp2p.site/auth/google";
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="md:hidden min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <Logo />
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Sign up</h1>
            <p className="text-gray-500 text-sm">
              Sign up to enjoy the feature of HD
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Your Name
              </label>
              <InputField
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Date of Birth
              </label>
              <InputField
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-500 mb-1">Email</label>
              <InputField
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-blue-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {showOtp && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">OTP</label>
                <InputField
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {error && <ErrorMessage message={error} />}

            {!showOtp ? (
              <Button
                onClick={handleGetOtp}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
              >
                {loading ? "Sending..." : "Get OTP"}
              </Button>
            ) : (
              <Button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
              >
                {loading ? "Verifying..." : "Sign Up"}
              </Button>
            )}

            {!showOtp && (
              <Button
                onClick={handleGoogleSignup}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium border border-gray-200"
              >
                Sign Up with Google
              </Button>
            )}

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <a href="/signin" className="text-blue-500 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex min-h-screen w-full">
        <div className="w-1/2 bg-white flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <Logo />
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-3 text-gray-900">Sign up</h1>
              <p className="text-gray-500">
                Sign up to enjoy the feature of HD
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Your Name
                </label>
                <InputField
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Date of Birth
                </label>
                <InputField
                  type="date"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-blue-500 mb-2">
                  Email
                </label>
                <InputField
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-blue-500 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {showOtp && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    OTP
                  </label>
                  <InputField
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              {error && <ErrorMessage message={error} />}

              {!showOtp ? (
                <Button
                  onClick={handleGetOtp}
                  disabled={loading}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-base"
                >
                  {loading ? "Sending..." : "Get OTP"}
                </Button>
              ) : (
                <Button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-base"
                >
                  {loading ? "Verifying..." : "Sign Up"}
                </Button>
              )}

              {!showOtp && (
                <Button
                  onClick={handleGoogleSignup}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-base"
                >
                  Sign Up with Google
                </Button>
              )}

              <p className="text-center text-sm text-gray-500 pt-4">
                Already have an account?{" "}
                <a href="/signin" className="text-blue-500 hover:underline">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>

        <div
          className="w-1/2 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundColor: "#1e3a8a",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SignUp;
