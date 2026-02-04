import { useState, useEffect, useRef } from "react";
import { IoIosTime } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/authContext";
import Map from "../components/Map";

const Cride = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
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
    // if(!isLoggedin){
    //   navigate("/login");
    //   return;
    // }
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
  }, [isLoggedin,navigate]);

  const rideOptions = [
    {
      provider: "Uber",
      price: "$15",
      arrivalTime: "5 mins",
      rating: 4.5,
      type: "Economy",
    },
    {
      provider: "Ola",
      price: "$12",
      arrivalTime: "3 mins",
      rating: 4.7,
      type: "Economy",
    },
    {
      provider: "Lyft",
      price: "$18",
      arrivalTime: "7 mins",
      rating: 4.6,
      type: "Premium",
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-6 md:px-10 py-4">
        <Link to="/">
          <img src="/logo.png" alt="Checkrr Logo" width={150} height={50} />
        </Link>
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
          <div className="flex space-x-2 md:space-x-4"></div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mt-6 text-blue-700">
        Compare Ride Prices
      </h1>

      {/* Search/Filter Section */}
      <div className="flex flex-col md:flex-row justify-center items-center mt-6 space-y-4 md:space-y-0 md:space-x-4 px-4">
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="p-2 border border-blue-300 rounded w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Drop-off Location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          className="p-2 border border-blue-300 rounded w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition" 
          onClick={() => {
            // Logic for searching based on pickup and dropoff
            console.log("Searching for rides from", pickup, "to", dropoff);
          }
        }>
          Search
        </button>
      </div>

      {/* Map Section */}
      <div className="w-full mt-10 px-4 md:px-10">
        <Map/>
      </div>
      
      {/* Comparison Results Section */}
      <div className="mt-10 w-full px-4 md:px-10">
        {rideOptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rideOptions.map((ride, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col border border-blue-300"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-blue-700">
                    {ride.provider}
                  </h3>
                  <span className="flex items-center text-blue-500">
                    <MdAttachMoney className="mr-1" /> {ride.price}
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-blue-500">
                  <span>{ride.arrivalTime} Away</span>
                  <span className="flex items-center">
                    <IoIosTime className="mr-1" /> {ride.rating} ★
                  </span>
                </div>
                <button className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-6 text-blue-600">No rides available.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-blue-600">
        <p>© 2024 Checkrr. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Cride;
