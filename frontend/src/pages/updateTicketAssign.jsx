import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateTicketAssign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    // Fetch ticket details
    const fetchTicket = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        });
        const data = await res.json();
        if (res.ok) {
          setTicket(data);
          setAssignedTo(data.assignedTo?._id || "");
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (error) {
        alert("Something went wrong while fetching ticket");
      }
    };
    // Fetch all users for assignment
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/non-users`, {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        }
      } catch (error) {
        // ignore
      }
    };
    fetchTicket();
    fetchUsers();
    setLoading(false);
    // eslint-disable-next-line
  }, [id]);

  const handleAssignChange = (e) => {
    setAssignedTo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}/changeAssigner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignedTo }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Ticket assignment updated!");
        navigate(`/tickets/${id}`);
      } else {
        alert(data.message || "Failed to update assignment");
      }
    } catch (error) {
      alert("Something went wrong while updating assignment");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !ticket) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }

  if (user.role !== "admin") {
    return <div className="text-center text-red-500">Only admin can update assignment.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 tracking-tight">
        Update Ticket Assignment
      </h2>
      <div className="card bg-base-100 shadow-xl border border-indigo-100 p-6 space-y-4 animate-fadeIn">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-indigo-800">{ticket.title}</h3>
          <p className="text-base text-gray-700">{ticket.description}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label font-semibold text-indigo-600">Assign To:</label>
            <select
              name="assignedTo"
              value={assignedTo}
              onChange={handleAssignChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Assigner</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateTicketAssign;
