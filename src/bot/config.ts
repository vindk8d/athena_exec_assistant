import { z } from 'zod';

export const botConfigSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
  OPENAI_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
});

export type BotConfig = z.infer<typeof botConfigSchema>;

export function getBotConfig(): BotConfig {
  const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  };

  return botConfigSchema.parse(config);
} 