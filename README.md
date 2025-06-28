# 🧠 AI-Powered Ticketing System

An intelligent, AI-driven support ticketing system that automates issue triaging, prioritization, response generation, and routing using **Inngest AI Agents**. Inspired by platforms like Stack Overflow, it enables users to raise technical issues and get AI-assisted support with minimal human intervention.

---

## 🚀 Features

- Role-based access: **User**, **Moderator**, **Admin**
- AI-generated helpful responses and prioritization
- Smart assignment to moderators using skill matching
- Automated email notifications on ticket events
- Fully event-driven architecture using **Inngest Workflows**
- Built-in support for ticket lifecycle: `To-Do`, `In-Progress`, `Completed`
![image](https://github.com/user-attachments/assets/6afd76bc-b8dc-4a0c-9d31-0f9338a325c7)

---

## 🧑‍🤝‍🧑 Roles & Functionalities

### 👤 User
- Signup/Login
- Create a new ticket describing an issue
- View ticket status and helpful AI-generated responses
- Receive email notifications on updates
- Track tickets by status: `To-Do`, `In-Progress`, `Completed`

---

### 🧑‍⚖️ Moderator
- Login and view tickets assigned to them
- Update ticket status (To-Do, In-Progress, Completed)
- Edit AI-provided helpful notes
- Close tickets and trigger email notification to the user

---

### 👩‍💼 Admin
- All moderator permissions
- View all tickets (assigned/unassigned)
- Manually assign tickets to moderators
- Reassign or directly resolve tickets
- Trigger moderator and user notifications on actions

---

## ⚙️ Ticket Lifecycle

1. User creates a ticket → Stored in DB with status `To-Do`
2. Triggers Inngest AI Agent → Ticket analyzed
3. AI adds helpful notes, assigns priority & skills
4. Ticket is auto-assigned to a moderator (or admin fallback)
5. Status updated to `In-Progress` → Email sent to user
6. Moderator resolves/mark ticket as `Completed` → Status updated to `Completed`
7. Email notification sent to user

User creates a ticket
![image](https://github.com/user-attachments/assets/834771eb-0b7f-4de6-ac07-b8c71a20ff04)

AI processes the ticket
![image](https://github.com/user-attachments/assets/99c922e1-0dec-4fcc-807e-c39eb6307097)

Moderator can change the ticket status/add additional notes
![image](https://github.com/user-attachments/assets/5262f0c4-20c6-45b7-9340-e73f5e103a02)

Admin can assign the ticket to any of the moderator and email sent out to moderator about the tikcet details
![image](https://github.com/user-attachments/assets/e456416f-6b56-4665-96e9-e0c235fd54b2)


---

## 🧠 Inngest AI Agent Integration

### What is an AI Agent?

An **AI Agent** in Inngest is an autonomous function powered by LLMs that:
- Understands ticket content
- Makes decisions (e.g., priority, skill tagging)
- Executes actions (e.g., update DB, assign ticket)

### Why Inngest?

- Handles asynchronous workflows cleanly
- Resumable, retryable, and event-driven
- Perfect for chaining AI logic and automating ticket triage

### AI Agent Responsibilities

- Analyze ticket content using an LLM (e.g., OpenAI/Gemini)
- Generate helpful notes and first response
- Classify ticket priority (Low / Medium / High)
- Identify required skills to solve the issue
- Assign the ticket to the best matching moderator
- Update ticket status to `In-Progress`
- Send an email to notify the user

---

## 🛠️ Events and Workflows Summary

| Event              | Triggered When                    | Handled By       | Action Taken                                                   |
|-------------------|-----------------------------------|------------------|----------------------------------------------------------------|
| `ticket.created`   | User creates a new ticket         | Inngest AI Agent | Analyzes, responds, prioritizes, assigns, updates & notifies   |
| `ticket.completed` | Ticket marked as complete         | Inngest Workflow | Sends closure email to user                                    |
| `ticket.assigned`  | Admin manually assigns a ticket   | Inngest Workflow | Notifies assigned moderator                                     |

Inngest Workflows
![image](https://github.com/user-attachments/assets/d65889dd-f706-445d-a7d2-4bddadc43a93)

---

## Tech Stack
![image](https://github.com/user-attachments/assets/109ad064-9584-48b8-b894-51f67186326c)

# Demo
https://drive.google.com/file/d/1ZINa-9Q6ZnwvSLZmVBqoqwQlVzr3JgOx/view?usp=sharing
