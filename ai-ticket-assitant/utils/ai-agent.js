import { createAgent, gemini, createNetwork} from "@inngest/agent-kit";


    const analyzeTicket = async(ticket) => {

        
         const supportAgent =  createAgent({
            model: gemini({
                model: "gemini-2.0-flash",
                apiKey: process.env.GEMINI_API_KEY,
            }),
            name:"AI Ticket Triage Assitant",
            system: `You are an expert AI assistant that process
            technical support tickets.
            Your job is to:
            1. Summarise the issue
            2. Estimate its priority
            3. Provide helpful notes and resource links for human moderators
            4. List relevant technical skills required

            IMPORTANT:
            - Respond with *ONLY* valid raw JSON
            - DO NOT include markdown, code fences, comments or any extra formatting
            - The format must be raw JSON object

            Repeat: DO NOT wrap your output in markdown or code fences. THE FORMAT MUST BE RAW JSON
            `
});


        console.log("Analyzing ticket with AI agent", ticket._id.toString())

        const response = await supportAgent.run(`You are a ticket triage agent. Only return a strict 
             JSON object with no extra text, header and markdown.
             Analyse the following support ticket and provide JSON object with:

             -summary: A short 1-2 sentence summary of issue
             -priority: One of "low", "medium", "high".
             -helpfulNotes: A detailed technical explanation that a moderator can  use to solve 
             this issue. Include useful external links or resources or docs if possible
             - relatedSkills: An array of relevant skills required to solve issue. Eg: ["Javascript"]
            
             RESPOND ONLY in this JSON format and do not include any other text
             {
               "summary": "Short summary of ticket",
               "priority":"high",
               "helpfulNotes":"Here are useful links",
               "relatedSkills: ["React", "C++"]
             }

             --Ticket Information
             -Title : ${ticket.title}
             -Description: ${ticket.description}
            
             `)


       const raw = response?.output[0].content
      
       try {
        const match= raw.match(/```json\s*([\s\S]*?)\s*```/i);
        const jsonString = match ? match[1] : raw.trim();
         console.log("AI Response:", jsonString)
        return JSON.parse(jsonString)
       } catch (e) {
           console.log("Failed to parse JSON from AI resp", e.message)
           return null; //watch out for this
       }
    }


export default analyzeTicket;