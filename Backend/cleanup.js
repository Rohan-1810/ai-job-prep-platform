require('dotenv').config();
const mongoose = require('mongoose');
const InterviewReportModel = require('./src/models/interviewReport.model');

async function cleanup() {
   try {
       console.log("Connecting to MongoDB...");
       await mongoose.connect(process.env.MONGO_URI);
       console.log("Connected.");

       const result = await InterviewReportModel.deleteMany({
           $or: [
               { title: "" },
               { title: { $exists: false } },
               { title: null }
           ]
       });
       
       console.log(`Cleanup complete. Deleted ${result.deletedCount} invalid/empty reports from the database.`);
       process.exit(0);
   } catch (error) {
       console.error("Cleanup failed:", error);
       process.exit(1);
   }
}

cleanup();
