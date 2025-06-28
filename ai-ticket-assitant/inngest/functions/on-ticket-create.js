import {inngest} from "../client.js";
import Ticket from "../../models/ticket.js"
import User from "../../models/user.js"
import { NonRetriableError } from "inngest";

import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai-agent.js";

export const onTicketCreated = inngest.createFunction(
    {id : 'on-ticket-created', retries: 2},
    {event: "ticket/created"},
    async ({event, step}) => {
        try {
            const {ticketId} = event.data

            //fetch ticket from DB
            const ticket = await step.run("fetch-ticket", async()=>{
                const ticketObject = await Ticket.findById(ticketId)
                if(!ticketObject)  {
                    throw new NonRetriableError("Ticket not found");
                }
                return ticketObject;
            }) 

            await step.run("update-ticket-status", async() => {
                await Ticket.findByIdAndUpdate(ticket._id,
                     {status:"TODO"})
            })

            const aiResponse = await analyzeTicket(ticket)

            //to find what AI tagged related skills
            const relatedSkills = await step.run("ai-processing", async()=>{
                let skills = []
                if(aiResponse) {
                    await Ticket.findByIdAndUpdate(ticket._id,{
                        priority: !["low", "medium", "high"].includes(aiResponse.priority) ?
                                    "medium" : aiResponse.priority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        status: "IN_PROGRESS",
                        relatedSkills: aiResponse.relatedSkills,
                    
                    })

                    skills = aiResponse.relatedSkills
                }
                return skills
            })

            //to find moderator whose skills matches relatedSkills
            const moderator = await step.run("assign-moderator", async() => {
                let user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch:{
                            $regex: relatedSkills.join("|"),
                            $options: "i"
                        }
                    }
                })

                if(!user) {
                    user = await User.findOne({
                        role:"admin"
                    })
                }

                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null
                })
                return user
            })
            
            await step.run("send-email-notification", async()=>{
                const finalTicket = await Ticket.findById(ticket._id)
                if(moderator) {
                   await sendMail(
                     moderator.email,
                     "Ticket Assigned", 
                     `Please have a look to ticket which is recently assigned to you.
                      Ticket Id is : ${finalTicket.title}`
                   )
                }
            })


            return {success: true}

        } catch (error) {
            console.error("Error occured while assigning ticket", error.message)
            return {success: false}
        }
    }
)


export const onTicketClosed = inngest.createFunction(
    {id : 'on-ticket-closed', retries: 2},
    {event: "ticket/closed"},
    async ({event, step} ) => {
        try{
           const {createdBy, title, status} = event.data
           console.log("Running step for finding ticket owner", {id})
           const user = await step.run("get-user-email", async() => {
            const  userObj = await User.findById(createdBy)
            if(!userObj) {
                throw new NonRetriableError("User no longer exist in DB")
            }
            return userObj
           })

           await step.run("send-close-ticket-mail", async()=>{
              const subject = `Status of Ticket: ${title} is ${status}.`
              const messg = `Hi,
              Check the helpful notes for more information.
              \n \n
              Thanks for signing up. Glad to have you!!
              `
              await sendMail(user.email, subject, messg);
           })

           console.log("Ticket closed and email sent to user", {email: user.email})

           return {success: true}
        }catch(err){
           console.error("Error running step", err.message)
           return {success: false}
        }
    }
)

export const onTicketUpdated = inngest.createFunction(
    {id : 'on-ticket-updated', retries: 2},
    {event: "ticket/updated"},
    async ({event, step} ) => {
        try{
           const {ticketId, status, assignedTo} = event.data
          
           const moderator = await User.findById(assignedTo);
           if(!moderator) {
              throw new NonRetriableError("User no longer exist in DB")
           }

           await step.run("send-email-notification", async()=>{
                const finalTicket = await Ticket.findById(ticketId)
                if(moderator) {
                   await sendMail(
                     moderator.email,
                     "Ticket Assigned", 
                     `Please have a look to ticket which is recently assigned to you.
                      Ticket Id is : ${finalTicket.title}`
                   )
                }
            })

           return {success: true}
        }catch(err){
           console.error("Error running step", err.message)
           return {success: false}
        }
    }
)

