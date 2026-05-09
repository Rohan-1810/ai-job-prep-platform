require('dotenv').config();
const { generateInterviewReport } = require('./src/services/ai.services');

(async () => {
    try {
        const res = await generateInterviewReport({
            resume: "I am a software engineer with 5 years of experience in React and Node.js.",
            selfDescription: "Passionate developer.",
            jobDescription: "Looking for a full stack engineer with React and Node.js skills."
        });
        console.log("RAW LLM OUTPUT:", JSON.stringify(res, null, 2));
        console.log("Success keys:", Object.keys(res));
    } catch (e) {
        console.error("Crash:", e.message);
    }
})();
