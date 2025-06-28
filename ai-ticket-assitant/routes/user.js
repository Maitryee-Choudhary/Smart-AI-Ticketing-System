import express from "express"
import { getUser,getNonUser, login, logout, signup, updateUser } from "../controllers/user.js"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()

router.post("/update", authenticate, updateUser)
router.get("/users", authenticate, getUser)
router.get("/non-users", authenticate, getNonUser)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)


export default router