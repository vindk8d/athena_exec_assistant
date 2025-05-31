import TelegramBot from 'node-telegram-bot-api';
import { getBotConfig } from './config';

const config = getBotConfig();
const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN);

// Export the bot instance for use in handlers
export default bot; 