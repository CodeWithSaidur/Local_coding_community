
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API,
});

interface Message {
    senderName?: string;
    content: string;
}

export async function generateConversationSummary(messages: Message[]) {
    if (messages.length === 0) return null;

    const conversationText = messages.map(m => `${m.senderName || 'User'}: ${m.content}`).join('\n');

    const prompt = `
    Analyze the following conversation history between learning partners.
    
    Conversation:
    ${conversationText}

    Task:
    Provide a structured summary including:
    1. "summary": A brief paragraph summarizing the key topics discussed.
    2. "action_items": A list of specific tasks or follow-ups mentioned.
    3. "key_points": A list of main takeaways.
    4. "next_steps": Suggested next steps for the pair.

    Return ONLY a valid JSON object.
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant that summarizes conversations into JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
        });

        const content = response.choices[0].message.content;
        if (!content) return null;

        return JSON.parse(content);
    } catch (error) {
        console.error("AI Summary Error:", error);
        return null;
    }
}
