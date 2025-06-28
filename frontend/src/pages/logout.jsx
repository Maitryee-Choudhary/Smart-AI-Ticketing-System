import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"

function Logout() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        setLoading(true)
        try {
            //Optionally, you can call an API to invalidate the session
            await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            localStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/login")
        } catch (error) {
            console.error("Logout failed:", error)
            alert("Something went wrong while logging out")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleLogout()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-sm shadow-xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title justify-center">Logging out...</h2>
                    {loading && <p>Loading...</p>}
                </div>
            </div>
        </div>
    )
}

export default Logout;