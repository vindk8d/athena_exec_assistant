import { NextApiRequest, NextApiResponse } from 'next';
import TelegramBot from 'node-telegram-bot-api';
import { getBotConfig } from '../../bot/config';
import { handleScheduleMeeting } from '../../bot/handlers/scheduleMeeting';
import { handleStart } from '../../bot/handlers/start';

const config = getBotConfig();
const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN);

// Initialize bot commands
bot.setMyCommands([
  { command: 'start', description: 'Start the bot' },
  { command: 'schedule', description: 'Schedule a meeting' },
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const update = req.body;
    
    try {
      if (update.message) {
        const msg = update.message;
        
        // Handle commands
        if (msg.text) {
          if (msg.text.startsWith('/start')) {
            await handleStart(msg);
          } else if (msg.text.startsWith('/schedule')) {
            await handleScheduleMeeting(msg);
          }
        }
      }
      
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 