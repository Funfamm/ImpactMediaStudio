import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real production app, ensure API keys are handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCastingFeedback = async (name: string, bio: string): Promise<string> => {
  try {
    const prompt = `
      You are an elite Hollywood Casting Director for a futuristic sci-fi franchise.
      The applicant's name is ${name}.
      Their bio/experience is: "${bio}".
      
      Provide a brief, encouraging, yet professional assessment (max 3 sentences) on how they might fit into a futuristic/cyberpunk setting. 
      Use a futuristic, slightly dramatic tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Feedback generation complete.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Transmission interrupted. AI Analysis offline.";
  }
};

export const generateSponsorResponse = async (companyName: string, message: string): Promise<string> => {
    try {
        const prompt = `
            Draft a formal, professional, and polite acknowledgement email response for a potential corporate sponsor named "${companyName}".
            They wrote: "${message}".
            The tone must be formal business communication.
            Keep it under 50 words. Mention "AI Impact Media".
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Thank you for your submission.";
    } catch (e) {
        return "Thank you for contacting AI Impact Media. We have received your inquiry.";
    }
}