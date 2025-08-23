  // Step 2 : OpenAI Summarization

 export async function summarizeCibilReport(extractedText) {
    const response = await openAi.chat.completions.create({
      model: "chatgpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a financial report analyzer. Extract the CIBIL score and classify the status.",
        },
        {
          role: "user",
          content: ` Document text:
          ${extractedText}

          Rules:
          - If score > 750 → "Good"
          - If score between 600 and 750 → "Risky"
          - If score < 600 → "Bad"

          Return only valid JSON with keys: cibil_score, status, remarks.
        `,
        },
      ],
      response_format: { type: "json" },
    });
    return JSON.parse(response.choices[0].message.content);
  }