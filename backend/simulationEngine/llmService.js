const { GoogleGenAI } = require('@google/genai');

const generateNarratives = async (profile, decision, optimistic, realistic, risk) => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("No GEMINI_API_KEY found. Using mock narratives.");
    return {
      optimisticNarrative: "Five years from now, you wake up in your dream tech job. Your hard work has paid off, leading to rapid promotions and a fulfilling career...",
      realisticNarrative: "In five years, you have a stable and respectable position. It wasn't always easy, but your consistent effort allowed you to build a solid foundation...",
      riskNarrative: "Fast forward five years: you faced significant hurdles. A lack of focus on key areas slowed your progress, but there's still time to pivot and recover..."
    };
  }

  try {
    const ai = new GoogleGenAI();

    const prompt = `You are a futuristic "Future Simulator" AI. 
Based on a user's profile and their specific decision: "${decision}", I have generated three heuristic scenarios for their life 5 years from now.
User Profile: Age ${profile.age}, ${profile.education} in ${profile.field}. Career Goal: ${profile.career_goal}.
Optimistic Scenario Summary: ${optimistic.summary}
Realistic Scenario Summary: ${realistic.summary}
Risk Scenario Summary: ${risk.summary}

Please write a short, vivid, and emotionally engaging "Day in the Life - 5 Years from Now" vignette (3-4 sentences) for EACH of the three scenarios. 
Format your response as a JSON object with exactly these keys:
"optimisticNarrative", "realisticNarrative", "riskNarrative"
Ensure valid JSON output without markdown formatting wrapping the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text);
  } catch (err) {
    console.error('LLM Generation Error:', err.message);
    return {
      optimisticNarrative: "Error generating optimistic narrative.",
      realisticNarrative: "Error generating realistic narrative.",
      riskNarrative: "Error generating risk narrative."
    };
  }
};

module.exports = { generateNarratives };
