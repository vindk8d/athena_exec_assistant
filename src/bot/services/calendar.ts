import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { getBotConfig } from '../config';

const config = getBotConfig();
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export class CalendarService {
  private auth: any;
  private calendar: any;

  async initialize() {
    this.auth = await authenticate({
      keyfilePath: 'credentials.json',
      scopes: SCOPES,
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  async getAvailableSlots(startDate: string, endDate: string, duration: number) {
    try {
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startDate,
          timeMax: endDate,
          items: [{ id: 'primary' }],
        },
      });

      const busySlots = response.data.calendars.primary.busy;
      const availableSlots = this.findAvailableSlots(busySlots, startDate, endDate, duration);
      
      return availableSlots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw error;
    }
  }

  private findAvailableSlots(busySlots: any[], startDate: string, endDate: string, duration: number) {
    const slots = [];
    let currentTime = new Date(startDate);

    while (currentTime < new Date(endDate)) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);
      
      const isSlotAvailable = !busySlots.some(busy => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return (
          (currentTime >= busyStart && currentTime < busyEnd) ||
          (slotEnd > busyStart && slotEnd <= busyEnd) ||
          (currentTime <= busyStart && slotEnd >= busyEnd)
        );
      });

      if (isSlotAvailable) {
        slots.push({
          start: currentTime.toISOString(),
          end: slotEnd.toISOString(),
        });
      }

      currentTime = new Date(currentTime.getTime() + 30 * 60000); // Move forward by 30 minutes
    }

    return slots;
  }

  async createEvent(summary: string, startTime: string, endTime: string, attendees: string[]) {
    try {
      const event = {
        summary,
        start: {
          dateTime: startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: endTime,
          timeZone: 'UTC',
        },
        attendees: attendees.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }
} 