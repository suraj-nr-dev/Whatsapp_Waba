# ReapLift WhatsApp WABA – Front End

Web panel for sending and tracking WhatsApp Business (WABA) campaigns, built in ReapLift branding.
This repository contains the UI only. All data is sample data until the backend API is connected.

## Tech

- React 19 + Vite
- Plain CSS (no Tailwind, no UI library)
- JavaScript
- `read-excel-file` for reading Excel headers in the browser

## Pages

**Dashboard**

- Consumption cards: Yesterday, Last 15 Days, This Month, Last Month
- Daywise Consumption bar chart
- Waba Information table

**Push Campaign**

- Step 1: campaign name, Waba account, template type (Utility / Marketing), template
- Step 2: send to File / Group / Tag, media file upload, workflow, schedule date and time
- Uploading an `.xlsx` file fills the mobile number field dropdown from its headers
  (MobileNumber, Number or PhoneNumber)
- Live WhatsApp-style preview of the message and uploaded media
- Success popup after submit

Other menu items show a "coming soon" page.

## Run

```
npm install
npm run dev
```

## Folder structure

```
src/
  components/   reusable pieces (Sidebar, Header, StatCard, PhonePreview, ...)
  pages/        Dashboard, PushCampaign
  data/         sample data – replace with API responses
  index.css     brand colours and shared form, button and message styles
```

## For the backend developer

- Sample data lives in `src/data/`. Each file has a `TODO (backend)` comment.
- The campaign form is submitted in `handleSubmit` in `src/pages/PushCampaign.jsx`;
  the API call goes at the `TODO (backend)` comment there.
