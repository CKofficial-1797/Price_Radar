import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";

export default function Cfood() {
  const [foodCategory, setFoodCategory] = useState("");
  const [location, setLocation] = useState("");
  const { user, setUser, isLoggedin, setIsLoggedin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setUser(null);
    setIsLoggedin(false);
    const res = await fetch("api/auth/logout", { method: "GET" });
    if (!res.ok) {
      console.error("Logout failed");
    }
    console.log("User logged out");
  };

  useEffect(() => {
    if(!isLoggedin){
      navigate("/login");
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoggedin, navigate]);

  const handleSearch = () => {
    // Logic for searching based on foodCategory and location
    console.log(`Searching for ${foodCategory} in ${location}`);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center">
      {/* Header with Logo linking to Landing Page */}
      <div className="w-full flex justify-between items-center px-6 md:px-10 py-4">
        <div className="flex-1 text-center">
          <Link to="/">
            <img src="/logo.png" alt="Checkrr Logo" width={150} height={50} />
          </Link>
        </div>
        {isLoggedin && user != null ? (
          <div className="relative inline-block text-left">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center space-x-2 bg-black text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-gray-800 transition duration-300"
            >
              <span>{user.name}</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
              >
                <Link
                  to="/update-profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Update Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          (navigate("/login"),
          (<div className="flex space-x-2 md:space-x-4"></div>))
        )}
      </div>

      {/* Comparison Section */}
      <div className="text-center mt-10 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800">
          Compare Food Prices
        </h1>
        <p className="text-lg md:text-xl mt-4 text-green-700">
          Find the best deals on your favorite meals!
        </p>
      </div>

      {/* Search Options Section */}
      <div className="w-full px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-center mb-8">
          <input
            type="text"
            placeholder="Enter food category (e.g., Pizza, Sushi)"
            value={foodCategory}
            onChange={(e) => setFoodCategory(e.target.value)}
            className="w-full md:w-1/3 p-2 mb-4 md:mb-0 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full md:w-1/3 p-2 mb-4 md:ml-4 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 md:ml-4"
          >
            Search
          </button>
        </div>
      </div>

      {/* Food Options Section */}
      <div className="w-full px-6 md:px-10">
        {/* Example Food Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img
              src="/food2.jpg"
              alt="Food Item 1"
              width={300}
              height={200}
              className="rounded"
            />
            <h2 className="text-lg font-semibold mt-2 text-green-600">
              Food Item 1
            </h2>
            <p className="text-sm text-green-500">Price: $10.99</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img
              src="/food2.jpg"
              alt="Food Item 2"
              width={300}
              height={200}
              className="rounded"
            />
            <h2 className="text-lg font-semibold mt-2 text-green-600">
              Food Item 2
            </h2>
            <p className="text-sm text-green-500">Price: $12.99</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img
              src="/food2.jpg"
              alt="Food Item 3"
              width={300}
              height={200}
              className="rounded"
            />
            <h2 className="text-lg font-semibold mt-2 text-green-600">
              Food Item 3
            </h2>
            <p className="text-sm text-green-500">Price: $8.99</p>
          </div>
          {/* Add more food items as needed */}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center">
        <p className="text-green-600">© 2024 Checkrr. All rights reserved.</p>
      </footer>
    </div>
  );
}
