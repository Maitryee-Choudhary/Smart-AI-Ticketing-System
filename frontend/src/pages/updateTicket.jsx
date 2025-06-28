import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" }
];

function TicketUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    
    status: "",
    helpfulNotes: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            method: "GET"
          }
        );
        const data = await res.json();
        console.log("Fetched ticket data:", data);
        if (res.ok) {
          setTicket(data);
          setForm({
            status: data.status || "TODO",
            helpfulNotes: data.helpfulNotes || ""
          });
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (error) {
        alert("Something went wrong while fetching ticket");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets/${id}/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Ticket updated successfully!");
        navigate(`/tickets/${id}`);
      } else {
        alert(data.message || "Failed to update ticket");
      }
    } catch (error) {
      alert("Something went wrong while updating ticket");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!ticket) {
    return <div className="text-center text-red-500">Ticket not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 tracking-tight">
        Update Ticket
      </h2>
      <div className="card bg-base-100 shadow-xl border border-indigo-100 p-6 space-y-4 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-indigo-800">{ticket.title}</h3>
          {ticket.status && (
            <span
              className={
                "badge px-4 py-2 text-sm font-semibold rounded-full " +
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
        </div>
        <p className="text-base text-gray-700">{ticket.description}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label font-semibold text-indigo-600">
              Status:
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label font-semibold text-indigo-600">
              Helpful Notes:
            </label>
            <textarea
              name="helpfulNotes"
              value={form.helpfulNotes}
              onChange={handleChange}
              className="textarea textarea-bordered w-full min-h-[100px]"
              placeholder="Add helpful notes for this ticket..."
            />
            <div className="mt-2 prose prose-sm bg-indigo-50 rounded p-2">
              <ReactMarkdown>{form.helpfulNotes}</ReactMarkdown>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TicketUpdate;