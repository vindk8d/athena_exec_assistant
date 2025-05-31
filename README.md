# Meeting Scheduler Telegram Bot

A Telegram bot that helps senior managers coordinate meeting times with their colleagues using AI-powered scheduling and Google Calendar integration.

## Features

- 🤖 Telegram bot interface for easy interaction
- 🧠 AI-powered meeting time suggestions using LangChain/OpenAI
- 📅 Google Calendar integration for availability checking
- 📧 Automatic email notifications to participants
- ⏰ Smart scheduling based on preferred dates and durations

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=your_google_redirect_uri
   ```

4. Set up Google Calendar API:
   - Go to the [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials
   - Download the credentials and save as `credentials.json` in the project root

5. Start the bot:
   ```bash
   npm start
   ```

## Usage

1. Start a chat with your bot on Telegram
2. Use the following commands:
   - `/start` - Get started with the bot
   - `/schedule` - Begin scheduling a new meeting
   - `/help` - Show available commands

3. When scheduling a meeting, the bot will:
   - Ask for participant email addresses
   - Request meeting duration
   - Ask for preferred dates
   - Get a brief description
   - Use AI to suggest the best time slot
   - Create the calendar event and notify participants

## Development

The project structure:
```
src/
  ├── bot/
  │   ├── config.ts
  │   ├── telegramBot.ts
  │   ├── handlers/
  │   │   ├── start.ts
  │   │   └── scheduleMeeting.ts
  │   └── services/
  │       └── calendar.ts
  └── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
