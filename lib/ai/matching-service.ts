
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API,
});

interface UserProfile {
    id: string;
    name: string;
    goals: string[];
}

export async function findMatches(currentUser: UserProfile, candidates: UserProfile[]) {
    if (candidates.length === 0) return [];

    const prompt = `
    You are an expert learning partner matcher.
    
    Current User:
    Name: ${currentUser.name}
    Goals: ${currentUser.goals.join(', ')}

    Candidates:
    ${candidates.map((c, i) => `${i}. ID: ${c.id}, Name: ${c.name}, Goals: ${c.goals.join(', ')}`).join('\n')}

    Task:
    Analyze the learning goals of the candidates and find the top 3 best matches for the Current User.
    Rank them by relevance.
    Provide a "matchScore" (0-100) and a brief "reason" for the match.

    Return ONLY a valid JSON array of objects with the following structure:
    [
      {
        "userId": "candidate_id",
        "matchScore": 85,
        "reason": "Both are interested in React and TypeScript..."
      }
    ]
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant that outputs strictly JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
        });

        const content = response.choices[0].message.content;
        if (!content) return [];

        // Safety: Handle potential wrapping in a key like "matches" or direct array
        const parsed = JSON.parse(content);
        const matches = Array.isArray(parsed) ? parsed : (parsed.matches || []);

        return matches.sort((a: any, b: any) => b.matchScore - a.matchScore);

    } catch (error) {
        console.error("AI Matching Error:", error);
        return [];
    }
}
