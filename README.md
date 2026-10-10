# ReapLift WhatsApp WABA

Web panel for sending and tracking WhatsApp Business (WABA) campaigns, built in ReapLift branding.

The project has two parts:

- `client/` – the React front end (what the user sees in the browser)
- `server/` – the Node.js backend (user login API)

User login is connected to the backend. The dashboard and campaign pages still show sample data.

## Tech

**Client**

- React 19 + Vite
- React Router for pages
- Plain CSS (no Tailwind, no UI library)
- `read-excel-file` for reading Excel headers in the browser

**Server**

- Node.js + Express 5
- `jsonwebtoken` for login tokens (JWT)
- `bcryptjs` for password hashing
- Users are stored in a JSON file for now (no database yet)

## Requirements

- Node.js 20 or newer
- npm

## Setup

Both parts need to be running at the same time, each in its own terminal.

### 1. Server

```
cd server
npm install
```

Copy `.env.example` to a new file named `.env` and set your own `JWT_SECRET`:

| Name             | What it is                                          | Default |
| ---------------- | --------------------------------------------------- | ------- |
| `PORT`           | Port the server runs on                             | `5000`  |
| `JWT_SECRET`     | Long random text used to sign login tokens. Required | –       |
| `JWT_EXPIRES_IN` | How long a login stays valid                        | `8h`    |

The server does not start without `JWT_SECRET`.

Create the first user (users are not saved in Git, so a fresh copy has none):

```
node scripts/set-password.js <userId> <password> "<Display Name>"
```

The password must be at least 6 characters. Running the same command for an existing user ID changes that user's password.

Start the server:

```
npm run dev
```

It runs at http://localhost:5000.

### 2. Client

```
cd client
npm install
npm run dev
```

Open http://localhost:5173/Whatsapp_Waba/ and log in with the user you created.

The client calls the backend at `http://localhost:5000`. To use another address, create `client/.env` with:

```
VITE_API_URL=https://api.example.com
```

## Scripts

**Client** (run inside `client/`)

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the dev server                  |
| `npm run build`   | Build for production into `dist/`     |
| `npm run preview` | Preview the production build          |
| `npm run lint`    | Check the code with oxlint            |

**Server** (run inside `server/`)

| Command       | What it does                                      |
| ------------- | ------------------------------------------------- |
| `npm run dev` | Start the server and restart it when a file changes |
| `npm start`   | Start the server                                  |

## Pages

| Address       | Page                                        | Needs login |
| ------------- | ------------------------------------------- | ----------- |
| `/login`      | Login                                       | No          |
| `/home`       | Home – choose WhatsApp or SMS               | Yes         |
| `/whatsapp/*` | WhatsApp WABA area                          | Yes         |
| `/sms/*`      | SMS Campaign area (coming soon)             | Yes         |

Any other address goes to Home.

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

Other menu items (Reports, Templates, Settings, Automation, ...) show a "coming soon" page.

## API

| Method | Address           | What it does                                   | Needs login |
| ------ | ----------------- | ---------------------------------------------- | ----------- |
| GET    | `/`               | Check that the server is running               | No          |
| GET    | `/api/message`    | Sample JSON message                            | No          |
| POST   | `/api/auth/login` | Log in. Body: `{ "userId": "...", "password": "..." }`. Returns `{ token, user }` | No |
| GET    | `/api/auth/me`    | Returns the logged-in user                     | Yes         |

Routes that need a login expect this header:

```
Authorization: Bearer <token>
```

Errors come back as `{ "error": "message" }`.

## How login works

1. The user enters a user ID and password on the Login page. User IDs are not case sensitive.
2. The server checks the password and returns a token.
3. The client saves the token in the browser (`localStorage`) and sends it with every API call.
4. When the page loads, the client calls `/api/auth/me` to check that the saved token still works.
5. If the token has expired, or the user was disabled, the user is logged out and sent back to Login.

## Folder structure

```
client/
  src/
    api/          client.js – all calls to the backend go through this file
    auth/         login state (AuthContext, AuthProvider)
    components/   reusable pieces (Sidebar, Header, StatCard, PhonePreview, ...)
    layouts/      AppShell, WhatsappLayout, SmsLayout
    pages/        Login, Home, Dashboard, PushCampaign
    data/         sample data and menu lists
    config.js     backend address
    index.css     brand colours and shared form, button and message styles
  vite.config.js

server/
  data/           userStore.js – reads and saves users (users.json)
  middleware/     auth.js – requireLogin, protects routes
  routes/         auth.js – login routes
  scripts/        set-password.js – create a user or change a password
  server.js       starting point of the server
  .env.example
```

## Not built yet

- Database – users are kept in `server/data/users.json`. Only `server/data/userStore.js` needs to change.
- Admin module – will replace `scripts/set-password.js`.
- Campaign and dashboard APIs – sample data lives in `client/src/data/`. Each file has a `TODO (backend)` comment, and the campaign form is submitted in `handleSubmit` in `client/src/pages/PushCampaign.jsx`.
- SMS Campaign area.

## Notes

- Never commit `server/.env` or `server/data/users.json`. Both are already in `.gitignore`.
- The app is served from `/Whatsapp_Waba/`. This is set by `base` in `client/vite.config.js`.
