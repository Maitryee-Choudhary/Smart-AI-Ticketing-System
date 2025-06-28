import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

function Signup() {
    const [form, setForm] = useState({
      name:"",
      email:"", 
      password:"",
      role:"user",
      skills: [],
    })

    const [loading, setLoading] = useState(false)

    const SKILLS = [
      "JavaScript", "Python", "React", "Node.js", "MongoDB", "AI", "DevOps"
    ];
    const ROLES = ["user", "moderator", "admin"];

    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSkillsChange = (e) => {
      const selected = Array.from(e.target.selectedOptions, opt => opt.value);
      setForm((prev) => ({
        ...prev,
        skills: selected
      }));
    };

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if(res.ok){
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                navigate("/")
            } else {
                alert(data.message || "Signup failed")
            }
        } catch (error) {
            alert("Signup-something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
         <div className="min-h-screen flex items-start justify-center bg-base-200 pt-24">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleSignup} className="card-body">
          <h2 className="card-title justify-center">Sign Up</h2>

          <div>
          <label className="label font-semibold text-indigo-600">Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input input-bordered"
            value={form.name}
            onChange={handleChange}
            required
          />
          </div>

          <div>
          <label className="label font-semibold text-indigo-600">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />
          </div>

          <div>
          <label className="label font-semibold text-indigo-600">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
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
          <div>
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
          </div>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
    )
}


export default Signup;