import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, deleteInterviewReport, downloadInterviewPdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            console.log("\n[useInterview] API Response:", response)

            // Frontend filter for valid reports only
            const validReports = response.interviewReports.filter(report => 
                (report.title && report.title.trim().length > 0) || report.status === "completed"
            )

            setReports(validReports)
            console.log(`[useInterview] Filtered down to ${validReports.length} valid reports out of ${response.interviewReports.length}.`)
            console.log("[useInterview] State updated with:", validReports)
        } catch (error) {
            console.error("[useInterview] Error fetching reports:", error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        let response = null
        try {
            response = await downloadInterviewPdf(interviewReportId)
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    const deleteReport = async (id) => {
        try {
            await deleteInterviewReport(id)
            setReports(prevReports => prevReports.filter(report => report._id !== id))
            return { success: true }
        } catch (error) {
            console.error("[useInterview] Error deleting report:", error)
            return { success: false, error }
        }
    }

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf, deleteReport }

}