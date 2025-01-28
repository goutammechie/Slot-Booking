import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login"); // Redirect to login page if not logged in
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Home Page</h1>

        {user ? (
          <div className="mt-6">
            <p className="text-lg font-medium">Welcome, {user.displayName || "User"}</p>
            <p className="text-sm text-gray-600">Email: {user.email}</p>
            <button
              onClick={() => {
                const auth = getAuth();
                auth.signOut();
              }}
              className="w-full px-4 py-2 mt-6 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
