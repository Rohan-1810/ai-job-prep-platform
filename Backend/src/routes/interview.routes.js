const express = require('express');
const authMiddleware=require('../middlewares/auth.middleware')
const interviewRouter = express.Router();
const interviewController = require('../controllers/interview.controller');
const { upload } = require('../middlewares/file.middleware');


/**
 * @route POST /api/interview/
 * @desc Generate an interview report based on the candidate's resume, self-description, and job description
 * @access private
 */

interviewRouter.post('/',authMiddleware.authUser,upload.single('resume'), interviewController.generateInterviewReportController);

/**
 * @route GET /api/interview/
 * @desc Get all interview reports for the logged-in user
 * @access private
 */
interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get('/report/:interviewId',authMiddleware.authUser,interviewController.getInterviewReportByIdController)

/**
 * @route DELETE /api/interview/report/:id
 * @desc Delete an interview report
 * @access private
 */
interviewRouter.delete('/report/:id', authMiddleware.authUser, interviewController.deleteInterviewReportController);

/**
 * @route GET /api/interview/report/:interviewId/pdf
 * @desc Generate and download resume PDF
 * @access private
 */
interviewRouter.get('/report/:interviewId/pdf', authMiddleware.authUser, interviewController.generateResumePdfController);


module.exports = interviewRouter;