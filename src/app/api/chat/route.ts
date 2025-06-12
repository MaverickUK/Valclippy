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

    // Generate current date and time information
    const now = new Date();
    const currentDateTime = {
      date: now.toISOString().split('T')[0], // YYYY-MM-DD
      time: now.toTimeString().split(' ')[0], // HH:MM:SS
      month: now.toLocaleString('default', { month: 'long' }), // Full month name
      year: now.getFullYear(),
      dayOfWeek: now.toLocaleString('default', { weekday: 'long' }), // Full day name
      timestamp: now.toISOString()
    };

    // Load system prompt from file
    const promptPath = path.join(process.cwd(), 'src', 'prompts', 'systemPrompt.txt');
    const systemPromptTemplate = fs.readFileSync(promptPath, 'utf-8');
    const systemPrompt = systemPromptTemplate
      .replace('{{CURRENT_DATETIME}}', JSON.stringify(currentDateTime, null, 2))
      .replace('{{INTERNAL_DATA}}', JSON.stringify(data, null, 2));

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