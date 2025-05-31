import { NextApiRequest, NextApiResponse } from 'next';
import TelegramBot from 'node-telegram-bot-api';
import { getBotConfig } from '../../bot/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const config = getBotConfig();
  const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN);

  try {
    // Get the webhook URL from the environment
    const webhookUrl = `${process.env.VERCEL_URL}/api/webhook`;
    
    // Set the webhook
    await bot.setWebHook(webhookUrl);
    
    // Get webhook info to verify
    const webhookInfo = await bot.getWebHookInfo();
    
    res.status(200).json({
      success: true,
      webhookInfo,
    });
  } catch (error) {
    console.error('Error setting up webhook:', error);
    res.status(500).json({ error: 'Failed to set up webhook' });
  }
} 