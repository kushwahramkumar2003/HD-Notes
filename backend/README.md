# HD Notes Backend

A Node.js/Express backend for HD Notes application with authentication and note management.

## Features

- User authentication with JWT
- Google OAuth integration
- Email OTP verification using Gmail SMTP
- Note CRUD operations
- PostgreSQL database with Prisma ORM

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# JWT
JWT_SECRET=your_jwt_secret

# Gmail SMTP Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

### 3. Gmail SMTP Setup

To use Gmail for sending OTP emails:

1. **Enable 2-Step Verification** in your Google Account
2. **Generate App Password**:

   - Go to Google Account > Security > 2-Step Verification
   - Click "App passwords"
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS` (not your regular Gmail password)

3. **Update .env file**:
   ```env
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

### 4. Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Test Email Configuration

```bash
npm run test-email
```

### 6. Start Development Server

```bash
npm run dev
```

## API Endpoints

- `POST /auth/send-otp-signup` - Send OTP for signup
- `POST /auth/verify-otp-signup` - Verify OTP and signup
- `POST /auth/send-otp-login` - Send OTP for login
- `POST /auth/verify-otp-login` - Verify OTP and login
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `POST /notes` - Create note (requires auth)
- `GET /notes` - Get user notes (requires auth)
- `DELETE /notes/:id` - Delete note (requires auth)
