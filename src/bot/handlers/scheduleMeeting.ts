import TelegramBot from 'node-telegram-bot-api';
import { google } from 'googleapis';
import { OpenAI } from '@langchain/openai';
import { getBotConfig } from '../config';
import bot from '../telegramBot';

const config = getBotConfig();
const openai = new OpenAI({ openAIApiKey: config.OPENAI_API_KEY });

interface MeetingState {
  participants: string[];
  duration: number;
  preferredDates: string[];
  description: string;
}

const userStates = new Map<number, MeetingState>();

export async function handleScheduleMeeting(msg: TelegramBot.Message): Promise<void> {
  const chatId = msg.chat.id;
  
  // Initialize meeting state
  userStates.set(chatId, {
    participants: [],
    duration: 0,
    preferredDates: [],
    description: ''
  });

  await bot.sendMessage(chatId, 
    "Let's schedule a meeting! 🗓️\n\n" +
    "Please provide the email addresses of the participants (comma-separated):"
  );

  // Set up message handler for collecting meeting details
  bot.once('message', async (response) => {
    if (response.chat.id === chatId) {
      const state = userStates.get(chatId);
      if (!state) return;

      state.participants = response.text?.split(',').map(email => email.trim()) || [];
      
      await bot.sendMessage(chatId, 
        "Great! How long should the meeting be (in minutes)?"
      );

      // Handle duration input
      bot.once('message', async (durationMsg) => {
        if (durationMsg.chat.id === chatId) {
          state.duration = parseInt(durationMsg.text || '30');
          
          await bot.sendMessage(chatId,
            "Please provide some preferred dates (comma-separated, format: YYYY-MM-DD):"
          );

          // Handle dates input
          bot.once('message', async (datesMsg) => {
            if (datesMsg.chat.id === chatId) {
              state.preferredDates = datesMsg.text?.split(',').map(date => date.trim()) || [];
              
              await bot.sendMessage(chatId,
                "Finally, please provide a brief description of the meeting:"
              );

              // Handle description input
              bot.once('message', async (descMsg) => {
                if (descMsg.chat.id === chatId) {
                  state.description = descMsg.text || '';
                  
                  // Process the meeting request
                  await processMeetingRequest(chatId, state);
                }
              });
            }
          });
        }
      });
    }
  });
}

async function processMeetingRequest(chatId: number, state: MeetingState): Promise<void> {
  try {
    // Use LangChain to analyze the meeting request
    const prompt = `
      Analyze this meeting request and suggest the best time slot:
      Participants: ${state.participants.join(', ')}
      Duration: ${state.duration} minutes
      Preferred Dates: ${state.preferredDates.join(', ')}
      Description: ${state.description}
    `;

    const response = await openai.call(prompt);
    
    // TODO: Integrate with Google Calendar API to check actual availability
    // and create the calendar event

    await bot.sendMessage(chatId,
      "I've analyzed your meeting request. Here's what I suggest:\n\n" +
      response +
      "\n\nWould you like me to create this calendar event? (yes/no)"
    );

    // Handle confirmation
    bot.once('message', async (confirmation) => {
      if (confirmation.chat.id === chatId && confirmation.text?.toLowerCase() === 'yes') {
        // TODO: Create calendar event
        await bot.sendMessage(chatId, "Calendar event created! I'll notify all participants.");
      } else {
        await bot.sendMessage(chatId, "Meeting scheduling cancelled.");
      }
      userStates.delete(chatId);
    });
  } catch (error) {
    console.error('Error processing meeting request:', error);
    await bot.sendMessage(chatId, "Sorry, there was an error processing your request. Please try again.");
    userStates.delete(chatId);
  }
} 