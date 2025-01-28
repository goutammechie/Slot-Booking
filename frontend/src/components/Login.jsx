import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, loginWithGoogle } from "./firebase"; // Ensure the path is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook to navigate to another page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
        navigate("/home"); // Redirect to home after login
      } else {
        await registerUser(email, password);
        alert("Account created successfully!");
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message); // Display Firebase error messages
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/home"); // Redirect to home after Google login
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex flex-col">
  
  <header className="w-full bg-blue-600 text-white text-center p-6 fixed top-0 left-0 z-10">
    <h1 className="text-2xl font-semibold">
      Get ready to hit it out of the park—book your game, reserve your spot, and play cricket like never before!
    </h1>
  </header>
  
  
  <div className="flex-grow flex items-center justify-center pt-24">
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isLogin ? "Login" : "Register"}
      </h1>
  
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-600 text-sm rounded-lg">
          <p>{error}</p>
        </div>
      )}
  
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mt-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            required
          />
        </div>
  
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mt-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            required
          />
        </div>
  
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>
      </form>
  
      <button
        onClick={handleGoogleLogin}
        className="w-full px-4 py-3 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out"
      >
        {loading ? "Processing..." : "Login with Google"}
      </button>
  
      <p className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline focus:outline-none transition duration-300 ease-in-out"
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  </div>
</div>

  );
  

};

export default Login;
