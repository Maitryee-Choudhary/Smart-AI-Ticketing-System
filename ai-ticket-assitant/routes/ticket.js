import express from "express"
import { getUser, login, logout, signup, updateUser } from "../controllers/user.js"
import { authenticate } from "../middlewares/auth.js"
import { createTicket, getTicket, getTickets, getAssignedTickets, updateTicket, updateAssigner } from "../controllers/ticket.js"


const router = express.Router()

router.get("/:id", authenticate, getTicket)
router.get("/", authenticate, getTickets)
router.post("/", authenticate, createTicket)
router.get("/myassigned/:id", authenticate, getAssignedTickets)
router.post("/:id/update", authenticate, updateTicket)
router.post("/:id/changeAssigner", authenticate, updateAssigner)

export default router