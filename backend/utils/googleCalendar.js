const { google } = require('googleapis');
const readline = require('readline');
const dotenv = require("dotenv");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log('🔗 Setting up Google OAuth2 Client...');
console.log(process.env.GOOGLE_CLIENT_ID ? '✅ Client ID found' : '❌ Client ID not set');
console.log(process.env.GOOGLE_CLIENT_SECRET ? '✅ Client Secret found' : '❌ Client Secret not set');
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function createCalendarEvent({ date, time, email, summary }) {
  oauth2Client.setCredentials({
    refresh_token: process.env.CALENDER_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const normalizedTime = time.replace(/(AM|PM)/i, ' $1').trim(); 
  const dateTimeString = `${date} ${normalizedTime}`;
  const startDateTime = new Date(dateTimeString);

  if (isNaN(startDateTime)) {
    throw new Error(`Invalid date/time value: "${dateTimeString}"`);
  }

  const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // +30 minutes

  const event = {
    summary: summary || 'Consultation Meeting',
    description: 'Auto-scheduled meeting',
    start: { dateTime: startDateTime.toISOString() },
    end: { dateTime: endDateTime.toISOString() },
    attendees: [{ email }],
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
  });

  return response.data.hangoutLink;
}

async function getNewRefreshToken() {
  const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('🔗 Visit this URL to authorize:\n', authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('\nEnter the code from that page here: ', async (code) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('\n✅ Your refresh token is:\n', tokens.refresh_token);
    } catch (err) {
      console.error('❌ Error retrieving access token:', err.message);
    } finally {
      rl.close();
    }
  });
}
// getNewRefreshToken();
module.exports = {
  createCalendarEvent,
  getNewRefreshToken,
};
