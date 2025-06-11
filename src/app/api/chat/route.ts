import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return NextResponse.json({ message: 'API key not configured. Please set OPENAI_API_KEY environment variable.' });
    }

    // Get model from env, default to 'gpt-4o-mini'
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // Load fictional data
    const dataPath = path.join(process.cwd(), 'src', 'app', 'api', 'chat', 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Compose system prompt with fictional data
    const systemPrompt = `You are ValClippy, an assistant that helps users find information about internal projects and people. Here is the internal data you can use to answer questions:\n${JSON.stringify(data, null, 2)}

When responding about people, format each person like this example:

PERSON: [Initials]|[Full Name]|[Job Title]|[Description of their work/contributions]|[skill1,skill2,skill3]|[project1,project2,project3]

Use this exact format with PERSON: prefix and pipe separators. Use commas to separate individual skills and projects within each field.

When responding about projects, use this format:

How exciting!

Here's what I know about [Project Name]...

TOPIC: People on the project
TOPIC: Existing project documentation  
TOPIC: Design insights
TOPIC: Technical insights
TOPIC: [Other relevant areas based on available data]

Would you like to know about one of these areas specifically, or multiple topics?

Use this exact format for projects, with "TOPIC:" prefix for each clickable area. Include relevant topic areas based on the project data available.

When responding about project documentation specifically, use this special format:

DOCLIST: [Project Name]|[doc1 name]:[source]:[last modified]::[warning]|[doc2 name]:[source]:[last modified]::|...

For example:
DOCLIST: EasyJet|Sprint Planning Notes:confluence:2 days ago by BG::|Burndown Chart:excel:4 days ago by BG::|Definition of Done:confluence:A year ago by BG::May be outdated

Use this exact format when someone asks about documentation for a project. Note the double colon (::) where URL would be - this is required for parsing. The warning field is optional and should only be included if there's a warning in the data.

When responding about someone's holidays or vacation schedule, use this special format:

HOLIDAYS: [Initials]|[Full Name]|[Job Title]|[date1],[date2],[date3],...

For example:
HOLIDAYS: GT|Gavin Thomas|Frontend Architect|2025-02-10,2025-02-11,2025-02-12,2025-02-13,2025-02-14,2025-04-07,2025-04-08

Use this exact format when someone asks about holidays, vacation days, time off, or when someone will be away. Include the person's initials, full name, and job title, then convert the holiday data from the JSON into this comma-separated format.`;

// https://platform.openai.com/docs/pricing
// model: 'gpt-3.5-turbo',

    // Call OpenAI API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 300,
      }),
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.text();
      console.error('OpenAI API error:', openaiRes.status, errorData);
      return NextResponse.json({ message: `API Error: ${openaiRes.status} - Please check your API key and quota.` });
    }

    const openaiData = await openaiRes.json();
    const assistantMessage = openaiData.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ message: 'Sorry, something went wrong with the chat service.' });
  }
} 