'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { google } from 'googleapis';

const CreateCalendarEventInputSchema = z.object({
  title: z.string().describe('The title or summary of the event.'),
  description: z.string().describe('A short description of the event.'),
  startTime: z
    .string()
    .datetime()
    .describe('The start time of the event in ISO 8601 format.'),
  endTime: z
    .string()
    .datetime()
    .describe('The end time of the event in ISO 8601 format.'),
});

// This is a placeholder for getting the user's OAuth token.
// In a real application, you would securely retrieve this from a database
// after the user has gone through an OAuth 2.0 flow.
async function getOAuthToken(userId: string): Promise<string | null> {
  // For now, this is a placeholder. It should return a valid OAuth2 access token.
  // We'll simulate this by returning null, which will cause the tool to respond
  // that the user needs to connect their account.
  console.warn(
    'Placeholder getOAuthToken called. Real implementation needed.'
  );
  return null;
}

export const createCalendarEventTool = ai.defineTool(
  {
    name: 'createCalendarEvent',
    description: 'Creates an event in the user\'s Google Calendar.',
    inputSchema: CreateCalendarEventInputSchema,
    outputSchema: z.string(),
  },
  async (input, { auth }) => {
    if (!auth) {
      return 'I cannot access the calendar because the user is not logged in.';
    }

    const oauthToken = await getOAuthToken(auth.uid);

    if (!oauthToken) {
      return "It looks like the user hasn't connected their Google Calendar yet. Please ask them to connect their account from the settings page before you can add events.";
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: oauthToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: input.title,
          description: input.description,
          start: {
            dateTime: input.startTime,
            timeZone: 'America/Los_Angeles', // This could be made dynamic
          },
          end: {
            dateTime: input.endTime,
            timeZone: 'America/Los_Angeles',
          },
        },
      });

      if (event.data.htmlLink) {
        return `Event created successfully! You can view it here: ${event.data.htmlLink}`;
      }
      return 'Event created successfully.';
    } catch (error) {
      console.error('Error creating calendar event:', error);
      // Check if the error is related to authentication
      if (
        (error as any).code === 401 ||
        (error as any).message.includes('invalid_credentials')
      ) {
        return "I couldn't create the event. It seems there's an issue with the calendar connection. Please ask the user to reconnect their Google Calendar account from the settings page.";
      }
      return 'Sorry, I was unable to create the event in the calendar.';
    }
  }
);
