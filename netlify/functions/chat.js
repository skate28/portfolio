const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { message } = JSON.parse(event.body);
    
    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: message
      }],
      system: "You are a helpful AI assistant embedded in Nick Lopacki's portfolio website. You can help visitors learn more about Nick's services, experience, and projects. Keep responses concise and professional."
    });

    // Return the response
    return {
      statusCode: 200,
      body: JSON.stringify({ response: response.content[0].text })
    };
  } catch (error) {
    console.error('Chat error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process chat message' })
    };
  }
};