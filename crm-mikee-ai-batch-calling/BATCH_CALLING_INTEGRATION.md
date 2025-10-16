# ElevenLabs Batch Calling Integration

This document describes the ElevenLabs batch calling integration added to the Mikee.ai CRM.

## Overview

The batch calling feature allows you to initiate multiple outbound calls simultaneously using ElevenLabs AI agents. You can select contacts from your CRM, configure the campaign, and schedule calls to be made immediately or at a specific time.

## Features

### 1. Batch Call Management
- View all batch calling campaigns
- Monitor campaign status and progress in real-time
- Track individual call statistics
- Cancel ongoing campaigns

### 2. Campaign Creation
- **Step 1: Campaign Details**
  - Set campaign name
  - Select ElevenLabs agent
  - Choose phone number for outbound calls

- **Step 2: Select Recipients**
  - Browse and search CRM contacts
  - Select individual contacts or bulk select
  - Filter contacts with valid phone numbers
  - See selected contact count

- **Step 3: Schedule**
  - Send immediately or schedule for later
  - Set specific date and time for scheduled campaigns
  - Review campaign summary before submission

### 3. Real-time Monitoring
- Campaign status tracking (pending, in_progress, completed, failed, cancelled)
- Progress bars showing calls dispatched vs scheduled
- Detailed statistics dashboard
- Individual call status tracking

## API Endpoints

### Create Batch Call
```
POST /api/batch-calls
```

**Request Body:**
```json
{
  "call_name": "Weekly Follow-up Campaign",
  "agent_id": "your_agent_id",
  "agent_phone_number_id": "your_phone_number_id",
  "recipients": [
    {
      "phone_number": "+1234567890",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "company": "Example Corp"
    }
  ],
  "scheduled_time_unix": 1234567890
}
```

**Response:**
```json
{
  "id": "batch_call_id",
  "phone_number_id": "phone_id",
  "name": "Weekly Follow-up Campaign",
  "agent_id": "agent_id",
  "created_at_unix": 1234567890,
  "scheduled_time_unix": 1234567890,
  "total_calls_dispatched": 0,
  "total_calls_scheduled": 10,
  "last_updated_at_unix": 1234567890,
  "status": "pending",
  "agent_name": "Sales Agent",
  "phone_provider": "twilio"
}
```

### List Batch Calls
```
GET /api/batch-calls
```

**Response:**
```json
{
  "batch_calls": [
    {
      "id": "batch_call_id",
      "name": "Campaign Name",
      "status": "in_progress",
      "total_calls_dispatched": 5,
      "total_calls_scheduled": 10,
      ...
    }
  ]
}
```

### Get Batch Call Details
```
GET /api/batch-calls/[id]
```

### Cancel Batch Call
```
DELETE /api/batch-calls/[id]
```

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env.local` file:

```bash
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 2. Get ElevenLabs Credentials

1. **API Key:**
   - Go to [ElevenLabs Dashboard](https://elevenlabs.io/app)
   - Navigate to Settings → API Keys
   - Create or copy your API key

2. **Agent ID:**
   - Go to Agents Platform
   - Select your agent
   - Copy the Agent ID from the URL or settings

3. **Phone Number ID:**
   - Go to Phone Numbers section
   - Select your phone number
   - Copy the Phone Number ID

### 3. Install Dependencies

The integration uses existing Next.js dependencies. No additional packages required.

### 4. Deploy

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the server
npm start
```

## Usage Guide

### Creating a Batch Call Campaign

1. **Navigate to Batch Calls**
   - Click "Batch Calls" in the navigation menu
   - Click "Create Batch Call" button

2. **Configure Campaign Details**
   - Enter a descriptive campaign name
   - Provide your ElevenLabs Agent ID
   - Provide your ElevenLabs Phone Number ID
   - Click "Next"

3. **Select Recipients**
   - Search and filter contacts
   - Select individual contacts or use "Select All"
   - Ensure selected contacts have valid phone numbers
   - Click "Next"

4. **Schedule Campaign**
   - Choose "Send Immediately" or "Schedule for Later"
   - If scheduling, select date and time
   - Review campaign summary
   - Click "Submit Campaign"

### Monitoring Campaigns

1. **Dashboard Overview**
   - View total campaigns, active campaigns, completed campaigns
   - See total calls across all campaigns
   - Monitor real-time statistics

2. **Campaign Details**
   - Click on any campaign to view details
   - See progress bar showing calls dispatched vs scheduled
   - Monitor individual call statuses
   - View timestamps and agent information

3. **Campaign Status**
   - **Pending:** Campaign is scheduled but not started
   - **In Progress:** Calls are being made
   - **Completed:** All calls finished
   - **Failed:** Campaign encountered an error
   - **Cancelled:** Campaign was manually cancelled

## File Structure

```
app/
├── api/
│   └── batch-calls/
│       ├── route.ts              # List and create batch calls
│       └── [id]/
│           └── route.ts          # Get details and cancel batch call
├── batch-calls/
│   ├── page.tsx                  # Batch calls list page
│   ├── create/
│   │   └── page.tsx              # Create batch call wizard
│   └── [id]/
│       └── page.tsx              # Batch call details page (optional)
└── layout.tsx                    # Updated with Batch Calls nav link
```

## ElevenLabs API Documentation

For more information about the ElevenLabs Batch Calling API:
- [Batch Calling Overview](https://elevenlabs.io/docs/agents-platform/phone-numbers/batch-calls)
- [API Reference](https://elevenlabs.io/docs/api-reference/batch-calling/create)

## Compliance

When conducting outbound call campaigns, ensure compliance with:
- **TCPA (Telephone Consumer Protection Act)**
- Applicable state laws
- Do Not Call (DNC) registry requirements
- Consent and opt-in requirements

## Troubleshooting

### Common Issues

1. **"ElevenLabs API key not configured"**
   - Ensure `ELEVENLABS_API_KEY` is set in `.env.local`
   - Restart the development server after adding environment variables

2. **"Failed to submit batch call"**
   - Verify your Agent ID is correct
   - Verify your Phone Number ID is correct
   - Check that your ElevenLabs account has sufficient credits
   - Ensure phone numbers are in E.164 format (+1234567890)

3. **No contacts showing in recipient selection**
   - Ensure contacts have valid phone numbers in the database
   - Check that the contacts API is working correctly

## Future Enhancements

Potential improvements for the batch calling feature:

1. **CSV Upload:** Allow uploading recipient lists via CSV
2. **Dynamic Variables:** Support for personalized variables in calls
3. **Call Recording:** Access and playback call recordings
4. **Analytics:** Detailed analytics and reporting
5. **Templates:** Save and reuse campaign templates
6. **A/B Testing:** Test different agents or scripts
7. **Webhooks:** Real-time notifications for call events
8. **Call Transcripts:** View transcripts of completed calls

## Support

For issues or questions:
- ElevenLabs Support: https://help.elevenlabs.io
- Mikee.ai Support: https://help.manus.im

## License

© 2025 Mikee AI. All rights reserved.

