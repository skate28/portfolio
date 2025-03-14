const express = require('express');
const fs = require('fs');
const { marked } = require('marked');
const path = require('path');

// Load environment variables with explicit path to .env file
const dotenv = require('dotenv');
const result = dotenv.config({ path: path.resolve(__dirname, '.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const Anthropic = require('@anthropic-ai/sdk');

// Log the API key (first few characters) to verify it's being loaded correctly
console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...' : 'undefined');

// Create the Anthropic client with the API key correctly formatted
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const app = express();
app.use(express.json()); // This line ensures your server can parse JSON.
app.use(cors());
const PORT = process.env.PORT || 3000  // Updated to use the PORT environment variable

// Serve static files from your main project folder
app.use(express.static(__dirname));

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for blog posts
app.get('/blog/:postName', (req, res) => {
    const postName = req.params.postName;

    // Path to your markdown files and template file
    const markdownFilePath = path.join(__dirname, 'blog', `${postName}.md`);
    const templateFilePath = path.join(__dirname, 'template', 'template.html');

    fs.readFile(markdownFilePath, 'utf8', (err, markdownData) => {
      if (err) {
        return res.status(404).send('Post not found');
      }

      const htmlContent = marked(markdownData);

      fs.readFile(templateFilePath, 'utf8', (templateErr, templateData) => {
        if (templateErr) {
          return res.status(500).send('Error reading template file');
        }

        let finalHtml = templateData.replace('{{title}}', postName)
                                     .replace('{{content}}', htmlContent);

        res.send(finalHtml);
      });
    });
});

// Endpoint to get Stripe full stack public key
app.get('/full-stack-stripe-key', (req, res) => {
  res.json({ fullStackPublishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.post('/create-checkout-session', async (req, res) => {
  const { packageType } = req.body; // Extract the package type from the request
  let priceInCents;

  switch(packageType) {
    case 'basic':
      priceInCents = 100000; // $1000.00
      break;
    case 'universal':
      priceInCents = 200000; // $2000.00
      break;
    case 'custom':
      
      break;
    default:
      return res.status(400).send('Invalid package type');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: packageType.charAt(0).toUpperCase() + packageType.slice(1) + ' Package',
        },
        unit_amount: priceInCents,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://portfolio-app-1-ba5193e0d8bf.herokuapp.com/success',
    cancel_url: 'https://portfolio-app-1-ba5193e0d8bf.herokuapp.com/cancel',
  });

  res.json({ id: session.id });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: message
      }],
      system: "You are a helpful AI assistant embedded in Nick Lopacki's portfolio website. You can help visitors learn more about Nick's services, experience, and projects. Keep responses concise and professional."
    });

    res.json({ response: response.content[0].text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

app.get('/success', (req, res) => {
  res.send('Payment successful! We will contact you shortly to begin your project.');
});

app.get('/cancel', (req, res) => {
  res.send('Payment cancelled. Feel free to try again when youre ready.');
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
 