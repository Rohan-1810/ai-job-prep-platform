const { GoogleGenAI, Type } = require("@google/genai");
const puppeteer = require("puppeteer");
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');  

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewSchemaGemini = {
  type: Type.OBJECT,
  properties: {
    matchScore: { type: Type.INTEGER, description: "Match score between candidate and job description (0-100)" },
    technicalQuestions: {
      type: Type.ARRAY,
      description: "List of technical questions asked during the interview with their intentions and how to answer them effectively",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Technical question asked" },
          intention: { type: Type.STRING, description: "Intention behind the question" },
          answer: { type: Type.STRING, description: "How to answer it effectively" }
        }
      }
    },
    behavioralQuestions: {
      type: Type.ARRAY,
      description: "List of behavioral questions",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Behavioral question asked" },
          intention: { type: Type.STRING, description: "Intention behind the question" },
          answer: { type: Type.STRING, description: "How to answer it effectively" }
        }
      }
    },
    skillGaps: {
      type: Type.ARRAY,
      description: "Identified skill gaps",
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING, description: "The skill gap" },
          severity: { type: Type.STRING, description: "Severity of the gap: low, medium, high" }
        }
      }
    },
    preparationPlan: {
      type: Type.ARRAY,
      description: "Preparation plan steps",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "Day number (integer)" },
          focus: { type: Type.STRING, description: "Skill or topic to focus on" },
          tasks: {
            type: Type.ARRAY,
            description: "List of tasks",
            items: { type: Type.STRING }
          }
        }
      }
    },
    title: { type: Type.STRING, description: "Title of the job for which the  interview report is generated" }
  }
};

async function generateInterviewReport({resume, selfDescription, jobDescription}) {
  try {
    const prompt = `You are an AI career coach. Based on the following information, generate a comprehensive interview report for the candidate.

      Candidate's Resume:
      ${resume}

      Candidate's Self Description:
      ${selfDescription}

      Job Description:
      ${jobDescription}
      
      Return a JSON object exactly matching the schema.`;

    const maxRetries = 3;
    const baseDelayMs = 2000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: interviewSchemaGemini
          }
        });
        return JSON.parse(response.text);
      } catch (error) {
        if (error.status === 503 && attempt < maxRetries) {
          console.log(`[AI Target 503] Model busy. Retrying attempt ${attempt} of ${maxRetries} in ${baseDelayMs * attempt}ms...`);
          await new Promise(resolve => setTimeout(resolve, baseDelayMs * attempt));
          continue;
        }
        throw error;
      }
    }

  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return Buffer.from(pdfBuffer)
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const maxRetries = 3;
    const baseDelayMs = 2000;
    
    let response;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            response = await ai.models.generateContent({
                model: "gemini-3-flash-preview", // Use a stable model if possible, or keep as is
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(resumePdfSchema),
                }
            });
            break;
        } catch (error) {
            if (error.status === 503 && attempt < maxRetries) {
                console.log(`[AI Target 503] Model busy. Retrying PDF generation attempt ${attempt} of ${maxRetries} in ${baseDelayMs * attempt}ms...`);
                await new Promise(resolve => setTimeout(resolve, baseDelayMs * attempt));
                continue;
            }
            throw error;
        }
    }

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = {  generateInterviewReport, generateResumePdf };
