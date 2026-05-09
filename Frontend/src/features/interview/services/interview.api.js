import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}



/**
 * @description Service to delete an interview report by ID.
 */
export const deleteInterviewReport = async (id) => {
    const response = await api.delete(`/api/interview/report/${id}`);

    return response.data;
}



/**
 * @description Service to generate and download resume PDF based on interview report.
 */
export const downloadInterviewPdf = async (interviewId) => {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}/pdf`, {
      responseType: 'blob', // Important for handling binary data (PDF)
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Failed to generate PDF';
  }
};
