const pdfParse = require('pdf-parse');
const { generateInterviewReport, generateResumePdf } = require('../services/ai.services');
const InterviewReportModel = require('../models/interviewReport.model');

/**
 * @description Controller to generate an interview report based on the candidate's resume, self-description, and job description 
 */
async function generateInterviewReportController(req, res) {
    try {
        const resumeFile = req.file;
        if (!resumeFile) {
            return res.status(400).json({ error: "Resume file is required" });
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText();
        const { selfDescription, jobDescription } = req.body;

        console.log(`\n[Report Creation] Starting AI generation for user ${req.user.id}...`);

        let interviewReportByAi;
        try {
            interviewReportByAi = await generateInterviewReport({ resume: resumeContent, selfDescription, jobDescription });
        } catch (aiError) {
            console.error(`[Report Creation] AI Generation failed for user ${req.user.id}:`, aiError.message || aiError);
            return res.status(500).json({ error: "AI generation failed. Report was not created." });
        }

        if (!interviewReportByAi || !interviewReportByAi.title) {
            console.error(`[Report Creation] AI returned empty or invalid structured data for user ${req.user.id}.`);
            return res.status(500).json({ error: "AI generation produced invalid data. Report was not created." });
        }

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            status: "completed",
            ...interviewReportByAi,
        });

        console.log(`[Report Creation] Successfully saved report ${interviewReport._id} for user ${req.user.id}.`);

        res.status(201).json({ message: "Interview report generated successfully", interviewReport });
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({ error: "An error occurred while generating the interview report" });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await InterviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await InterviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    console.log(`\n[Backend API] Fetched ${interviewReports.length} reports for user ${req.user.id}`);

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewId } = req.params

    const interviewReport = await InterviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=resume_${interviewId}.pdf`
    })

    res.send(pdfBuffer)
}

/**
 * @description Controller to delete an interview report by interviewId.
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { id } = req.params;
        
        // Find by ID and User to ensure authorized deletion
        const deletedReport = await InterviewReportModel.findOneAndDelete({ _id: id, user: req.user.id });
        
        if (!deletedReport) {
            return res.status(404).json({ error: "Report not found or you are not authorized to delete it." });
        }
        
        res.status(200).json({ message: "Report deleted successfully." });
    } catch (error) {
        console.error("Error deleting interview report:", error);
        res.status(500).json({ error: "An error occurred while deleting the report." });
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, deleteInterviewReportController }


