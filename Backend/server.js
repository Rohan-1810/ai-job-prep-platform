require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();


const app = require('./src/app');
const connectToDB = require('./src/config/database');



const { generateInterviewReport } = require('./src/services/ai.services');
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log("Connecting to DB...");
        await connectToDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();