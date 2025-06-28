import React from "react"
import { use } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [assignedFilter, setAssignedFilter] = useState('ALL');
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const ticketsPerPage = 5;
  

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data || []);
      console.log("Fetched tickets:", data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  let filteredTickets = statusFilter === 'ALL'
    ? tickets
    : tickets.filter(ticket => ticket.status === statusFilter);
  if (user.role === 'admin' && assignedFilter === 'UNASSIGNED') {
    filteredTickets = filteredTickets.filter(ticket => !ticket.assignedTo);
  }
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {user.role === 'user' &&
        (<>
          <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>

          <form onSubmit={handleSubmit} className="space-y-3 mb-8">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ticket Title"
              className="input input-bordered w-full"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ticket Description"
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </>
        )}


      <h2 className="text-xl font-semibold mb-2 text-indigo-700">All Tickets</h2>
      <div className="mb-4 flex gap-2 items-center">
        <span className="font-medium">Filter:</span>
        <select
          className="select select-bordered select-sm"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="ALL">All</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        {user.role === 'admin' && (
          <>
            <span className="font-medium ml-4">Assignment:</span>
            <select
              className="select select-bordered select-sm"
              value={assignedFilter}
              onChange={e => { setAssignedFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All</option>
              <option value="UNASSIGNED">Unassigned</option>
            </select>
          </>
        )}
      </div>
      <div className="space-y-3">
        {currentTickets.length > 0 && currentTickets.map((ticket) => (
          <Link
            key={ticket._id}
            className="card bg-base-100 border border-indigo-200 shadow-lg p-4 transition-transform hover:scale-[1.02] hover:shadow-xl"
            to={user.role === 'admin' ? `/tickets/${ticket._id}/updateAssinger` : `/tickets/${ticket._id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg text-indigo-800">{ticket.title}</h3>
              <div className="flex items-center gap-2">
                {/* Status Badge */}
                {ticket.status && (
                  <span
                    className={
                      "badge px-3 py-1 text-xs font-semibold " +
                      (ticket.status === "COMPLETED"
                        ? "badge-success bg-green-100 text-green-800"
                        : ticket.status === "IN_PROGRESS"
                          ? "badge-warning bg-yellow-100 text-yellow-800"
                          : "badge-info bg-blue-100 text-blue-800")
                    }
                  >
                    {ticket.status === "TODO"
                      ? "To Do"
                      : ticket.status === "IN_PROGRESS"
                        ? "In Progress"
                        : ticket.status === "COMPLETED"
                          ? "Completed"
                          : ticket.status}
                  </span>
                )}
                {/* Unassigned Badge for admin */}
                {user.role === 'admin' && !ticket.assignedTo && (
                  <span className="badge badge-outline badge-error ml-1">Unassigned</span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-700">{ticket.description}</p>
            <p className="text-xs text-gray-500">
              Created At: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </Link>
        ))}
        {filteredTickets.length === 0 && <p>No tickets found for this filter.</p>}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}


export default Tickets;