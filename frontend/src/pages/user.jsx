import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"


const SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "MongoDB", "AI", "DevOps"
];
const ROLES = ["user", "moderator", "admin"];

export default function UserProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: [],
    role: "user"
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setForm({
      name: user.name || "",
      email: user.email || "",
      skills: user.skills || [],
      role: user.role || "user"
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
    setForm((prev) => ({
      ...prev,
      skills: selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token")
    setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/update`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}` ,
                },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            console.log("Update response:", data);
            if(res.ok){
               
                localStorage.setItem("user", JSON.stringify(data.data))
                 alert(data.message || "Profile update successful")
                navigate("/")
            } else {
                alert(data.message || "Profile update failed")
            }
        } catch (error) {
            alert("Profile update failed - something went wrong")
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false)
        }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-teal-50">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">User Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label font-semibold text-indigo-600">Name:</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label font-semibold text-indigo-600">Email:</label>
            <input
              name="email"
              value={form.email}
              disabled
              className="input input-bordered w-full bg-gray-100 text-gray-400"
            />
          </div>
          <div>
            <label className="label font-semibold text-indigo-600">Skills:</label>
            <select
              name="skills"
              multiple
              value={form.skills}
              onChange={handleSkillsChange}
              className="select select-bordered w-full h-32"
            >
              {SKILLS.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            <div className="mt-1 text-xs text-gray-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</div>
          </div>
       
          {/* <div>
            <label className="label font-semibold text-indigo-600">Role:</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div> */}
          <button type="submit" className="btn btn-primary w-full mt-4">Save</button>
        </form>
      </div>
    </div>
  );
}