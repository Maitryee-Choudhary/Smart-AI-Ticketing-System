import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js"
import ticketRoutes from "./routes/ticket.js"
import { serverKind } from "inngest/helpers/consts";
import {serve} from "inngest/express"
import {inngest} from "./inngest/client.js"
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import { createAgent, anthropic } from '@inngest/agent-kit';
import { createServer } from '@inngest/agent-kit/server';
import analyzeTicket from "./utils/ai-agent.js";
import { OpenAITest } from "./utils/openai.js";
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.PORT || 3000




const app = express()

//middleware betn backend and frontend
app.use(cors())
//to accept json data
app.use(express.json())


app.use("/api/inngest",
    serve({
        client: inngest,
        functions: [onUserSignup, onTicketCreated],
       
    })
)

app.use("/api/auth", userRoutes)
app.use("/api/tickets", ticketRoutes)


//OpenAITest();


mongoose.connect(
    process.env.MONGO_URI
).then( () => {
    console.log("Mongo DB connected")
    app.listen(PORT, () => console.log("Server connected to Port", PORT))

})
.catch((err)=> console.error("Mongo DB error", err))

