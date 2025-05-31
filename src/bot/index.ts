import bot from './telegramBot';
import { CalendarService } from './services/calendar';

async function main() {
  try {
    // Initialize calendar service
    const calendarService = new CalendarService();
    await calendarService.initialize();

    console.log('Bot started successfully!');
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

main(); 