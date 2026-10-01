const axios = require("axios");
const EmailHistory = require("../models/EmailHistory");

// ======================================================
// GENERATE EMAIL
// ======================================================

exports.generateEmail = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("============", prompt);

    // -----------------------------
    // Validate prompt
    // -----------------------------

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    if (typeof prompt !== "string") {
      return res.status(400).json({
        message: "Prompt must be a string",
      });
    }

    if (prompt.trim().length === 0) {
      return res.status(400).json({
        message: "Prompt cannot be empty",
      });
    }

    if (prompt.length > 2000) {
      return res.status(400).json({
        message: "Prompt cannot exceed 2000 characters",
      });
    }

    // -----------------------------
    // Groq API Key
    // -----------------------------

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return res.status(500).json({
        message: "AI service is not configured",
      });
    }

    // -----------------------------
    // User prompt
    // -----------------------------

    const userPrompt = `
You are an expert job outreach strategist.

Generate professional cold outreach content based on the user's request.

USER REQUEST:
${prompt.trim()}

Create exactly these four fields:

1. subject
2. emailBody
3. linkedInDM
4. followUpEmail

Rules:

- Make reasonable professional assumptions if the request is short.
- Do not ask questions.
- Do not ask for clarification.
- Do not use markdown.
- Do not use emojis.
- Keep the writing professional and concise.

Subject:
- 6 to 9 words.
- Professional.
- Show candidate value.
- Avoid generic phrases.

Email body:
- Around 60 to 90 words.
- Mention a relevant observation.
- Mention a hiring or engineering challenge.
- Mention candidate experience.
- Mention candidate value.
- Include a clear call to action.
- Professional sign-off.

LinkedIn DM:
- Around 30 to 50 words.
- Conversational.
- Mention relevant value.
- Soft call to action.

Follow-up email:
- Around 50 to 80 words.
- Professional.
- Add a new angle.
- Mention long-term value.
- Clear call to action.

Return the result according to the JSON schema.
`;
    console.log("userPrompt======", userPrompt);

    // -----------------------------
    // Groq API
    // -----------------------------

    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],

        response_format: {
          type: "json_schema",

          json_schema: {
            name: "cold_email",

            strict: true,

            schema: {
              type: "object",

              properties: {
                subject: {
                  type: "string",
                },

                emailBody: {
                  type: "string",
                },

                linkedInDM: {
                  type: "string",
                },

                followUpEmail: {
                  type: "string",
                },
              },

              required: ["subject", "emailBody", "linkedInDM", "followUpEmail"],

              additionalProperties: false,
            },
          },
        },

        // GPT-OSS reasoning
        reasoning_effort: "low",

        // Don't let reasoning consume too much output
        max_completion_tokens: 2048,

        temperature: 0.6,

        stream: false,

        include_reasoning: false,
      },

      {
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },

        timeout: 30000,
      },
    );

    // -----------------------------
    // Debug complete response
    // -----------------------------

    console.log("GROQ RESPONSE:", JSON.stringify(aiResponse.data, null, 2));

    // -----------------------------
    // Validate response
    // -----------------------------

    if (
      !aiResponse.data ||
      !aiResponse.data.choices ||
      !aiResponse.data.choices[0] ||
      !aiResponse.data.choices[0].message
    ) {
      throw new Error("Invalid response from Groq API");
    }

    const message = aiResponse.data.choices[0].message;

    console.log("GROQ MESSAGE:", message);

    const generatedText = message.content;

    console.log("AI GENERATED TEXT:", generatedText);

    // -----------------------------
    // Empty response
    // -----------------------------

    if (!generatedText || !generatedText.trim()) {
      console.error("AI returned empty content");

      console.error("Finish reason:", aiResponse.data.choices[0].finish_reason);

      return res.status(500).json({
        message: "AI returned an empty response",
      });
    }

    // -----------------------------
    // Parse JSON
    // -----------------------------

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError.message);

      console.error("GENERATED TEXT:", generatedText);

      return res.status(500).json({
        message: "Failed to parse AI response",
        error: "AI returned invalid JSON",
      });
    }

    // -----------------------------
    // Validate generated fields
    // -----------------------------

    if (
      !parsedResponse.subject ||
      !parsedResponse.emailBody ||
      !parsedResponse.linkedInDM ||
      !parsedResponse.followUpEmail
    ) {
      console.error("INCOMPLETE AI RESPONSE:", parsedResponse);

      return res.status(500).json({
        message: "AI generated incomplete email data",
      });
    }

    // -----------------------------
    // Email data
    // -----------------------------

    const emailData = {
      subject: parsedResponse.subject,
      emailBody: parsedResponse.emailBody,
      linkedInDM: parsedResponse.linkedInDM,
      followUpEmail: parsedResponse.followUpEmail,
    };

    // -----------------------------
    // Save history
    // -----------------------------

    const historyEntry = await EmailHistory.create({
      user: req.user._id,

      prompt: prompt.trim(),

      subject: emailData.subject,

      emailBody: emailData.emailBody,

      linkedInDM: emailData.linkedInDM,

      followUpEmail: emailData.followUpEmail,
    });

    // -----------------------------
    // Send response
    // -----------------------------

    return res.status(200).json({
      message: "Email generated successfully",

      subject: emailData.subject,

      emailBody: emailData.emailBody,

      linkedInDM: emailData.linkedInDM,

      followUpEmail: emailData.followUpEmail,

      historyId: historyEntry._id,

      createdAt: historyEntry.createdAt,
    });
  } catch (error) {
    console.error("=================================");
    console.error("AI GENERATION ERROR");
    console.error("=================================");

    console.error(error.response?.data || error.message);

    // -----------------------------
    // Rate limit
    // -----------------------------

    if (error.response?.status === 429) {
      return res.status(429).json({
        message: "Too many requests. Please wait a moment before trying again.",

        error: "Rate limit exceeded",
      });
    }

    // -----------------------------
    // Groq bad request
    // -----------------------------

    if (error.response?.status === 400) {
      return res.status(400).json({
        message: "Groq rejected the request.",

        error: error.response?.data?.error?.message || error.message,

        details: error.response?.data?.error || null,
      });
    }

    // -----------------------------
    // General error
    // -----------------------------

    return res.status(500).json({
      message: "Failed to generate email",

      error: error.response?.data?.error?.message || error.message,
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await EmailHistory.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(history);
  } catch (error) {
    console.error("GET HISTORY ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to fetch history",
    });
  }
};
