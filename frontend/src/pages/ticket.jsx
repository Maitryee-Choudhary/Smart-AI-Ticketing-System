import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function Ticket() {
  const { id } = useParams()

  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    relatedSkills: [],
    helpfulNotes: "",
    assignedTo: "",
    createdAt: ""
  })
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")
  const fetchTicket = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );
      const data = await res.json()
      if (res.ok) {
        setTicket(data)
        console.log("Fetched ticket:", data)
      } else {
        alert(data.message || "Failed to fetch ticket")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong while fetchign ticket")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTicket();
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 tracking-tight">Ticket Details</h2>

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


        <div className="divider">Metadata</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ticket.priority && (
            <div>
              <span className="font-semibold text-indigo-600">Priority:</span>{" "}
              <span className="badge badge-outline">{ticket.priority}</span>
            </div>
          )}
          {ticket.relatedSkills?.length > 0 && (
            <div>
              <span className="font-semibold text-indigo-600">Related Skills:</span>{" "}
              <span className="flex flex-wrap gap-2 mt-1">
                {ticket.relatedSkills.map(skill => (
                  <span
                    key={skill}
                    className="badge badge-info badge-outline text-xs px-2 py-1"
                  >
                    {skill}
                  </span>
                ))}
              </span>
            </div>
          )}

          {ticket.createdAt && (
            <div>
              <span className="font-semibold text-indigo-600">Created At:</span>{" "}
              <span className="text-xs text-gray-500">
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {ticket.helpfulNotes && (
          <div>
            <div className="font-semibold text-indigo-600 mb-1">Helpful Notes:</div>
            <div className="prose max-w-none rounded bg-indigo-50 p-3">
              <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
            </div>
          </div>
        )}
        {ticket.assignedTo && (
          <div>
            <span className="font-semibold text-indigo-600">Assigned To:</span>{" "}
            <span className="badge badge-accent badge-outline">
              {ticket.assignedTo?.name}
            </span>
          </div>
        )}

      </div>
    </div>
  )
}


export default Ticket;