# Cold Calling Dashboard

An interactive dashboard for displaying cold calling team statistics, pulling data from Google Sheets.

## Features

- Real-time data from Google Sheets
- Key Performance Indicators (KPIs):
  - Connect Rate
  - Gatekeeper Rate
  - Conversion % (Connect → Meeting Scheduled)
- Weekly statistics:
  - Total Calls Made
  - Total Connects
  - Total Meetings Set
- Rep-specific metrics
- Visualizations:
  - Disposition Distribution (Donut Chart)
  - Calls by Date (Bar Chart)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Configuration

The dashboard automatically maps reps to their clients:
- Tom → NewCo Capital
- Bryan → NewCo Capital
- Afif → Baton Market
- Alex → Baton Market
- Mario → Kodem Security

The Google Sheet connection is configured in `src/services/googleSheets.js`. Make sure the sheet is publicly accessible or update the authentication method.

## Data Requirements

The Google Sheet should have the following columns:
- Timestamp
- Rep Name
- Disposition
- Duration (seconds)
- Other fields as needed

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.


