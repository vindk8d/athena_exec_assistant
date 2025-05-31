import TelegramBot from 'node-telegram-bot-api';
import bot from '../telegramBot';

export async function handleStart(msg: TelegramBot.Message): Promise<void> {
  const chatId = msg.chat.id;
  const welcomeMessage = `
👋 Welcome to the Meeting Scheduler Bot!

I can help you coordinate meeting times with your colleagues based on your calendar availability.

Available commands:
/schedule - Start scheduling a new meeting
/help - Show this help message

To get started, use /schedule to begin scheduling a meeting.
  `;

  await bot.sendMessage(chatId, welcomeMessage);
} 