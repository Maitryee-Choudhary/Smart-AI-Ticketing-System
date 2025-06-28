import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "user";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-lg px-6 py-3 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-white font-bold text-xl tracking-wide hover:text-cyan-100 transition">AI Ticket System</Link>
        {isLoggedIn && (
          <Link to="/" className="text-white hover:text-cyan-100 transition">View Tickets</Link>
        )}
        {isLoggedIn && (
          <Link to="/profile" className="text-white hover:text-cyan-100 transition">Profile</Link>
        )}
        {isLoggedIn && role !== "user" && (
          <Link to="/assigned" className="text-white hover:text-cyan-100 transition">My Assigned Tickets</Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-sm btn-primary">Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="btn btn-sm btn-error text-white">Logout</button>
        )}
      </div>
    </nav>
  );
}