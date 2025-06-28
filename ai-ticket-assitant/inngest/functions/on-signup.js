import {inngest} from "../client.js";
import User from "../../models/user.js"
import { NonRetriableError } from "inngest";

import { sendMail } from "../../utils/mailer.js";


export const onUserSignup = inngest.createFunction(
    {id : 'on-user-signup', retries: 2},
    {event: "user/signup"},
    async ({event, step} ) => {
        try{
           const {email} = event.data
           console.log("Running step for user signup", {email})
           const user = await step.run("get-user-email", async() => {
            const  userObj = await User.findOne({email})
            if(!userObj) {
                throw new NonRetriableError("User no longer exist in DB")
            }
            return userObj
           })

           await step.run("send-welcome-email", async()=>{
              const subject = `Welcome to app`
              const messg = `Hi, 
              \n \n
              THanks for signing up. Glad to have you!!
              `
              await sendMail(user.email, subject, messg);
           })

           return {success: true}
        }catch(err){
           console.error("Error running step", err.message)
           return {success: false}
        }
    }
)