# Clinic Scheduler System - Setup Instructions

## System Overview

This is a complete clinic appointment scheduling system with:
- **Guest Booking Interface**: Public-facing page for patients to book appointments
- **Admin Dashboard**: Protected admin portal with sidebar navigation
- **QR Code System**: Generate and download QR codes for easy appointment booking
- **Blue & White Theme**: Professional cool-tone color scheme

## Getting Started

### 1. Create an Admin Account

Before you can access the admin dashboard, you need to create an admin user in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter email and password for your admin account
5. Click **Create user**

This user will be able to log in at `/admin/login`

### 2. Access the Application

#### For Patients (Guests):
- Visit `/book` to book an appointment
- No login required
- Fill in patient details, select date/time, and submit

#### For Administrators:
- Visit `/admin/login` to sign in
- Use the credentials you created in Supabase
- Access the full admin dashboard

## Admin Portal Features

### Dashboard (`/admin/dashboard`)
- View total appointments statistics
- See today's appointments count
- Monitor pending, confirmed, completed, and cancelled appointments
- View recent appointments list

### Appointments (`/admin/appointments`)
- View all appointments in a table format
- Search patients by name, email, or phone
- Filter appointments by status
- Update appointment status (pending, confirmed, completed, cancelled)

### QR Code (`/admin/qr-code`)
- View QR code that links to the booking page
- Download QR code as PNG image
- Print QR code for physical display
- Copy booking URL to clipboard
- Instructions for using the QR code

### Settings (`/admin/settings`)
- Placeholder for future clinic configuration options

## Database Structure

### Tables Created:

1. **appointments**
   - Stores all patient appointment bookings
   - Fields: patient details, date/time, consultation type, status, notes
   - Guests can create appointments (public access)
   - Admins can view and update all appointments

2. **clinic_settings**
   - Stores configurable clinic settings
   - Default consultation types: General, Follow-up, Specialist, Emergency
   - Operating hours: 9:00 AM - 5:00 PM (weekdays)
   - 30-minute appointment slots

## Security Features

- Row Level Security (RLS) enabled on all tables
- Guests can only create appointments (no read/update/delete access)
- Only authenticated admin users can view and manage appointments
- Admin routes are protected with authentication checks

## Using the QR Code

1. Log in to the admin portal
2. Navigate to **QR Code** section
3. Download or print the QR code
4. Display it in your clinic:
   - Reception desk
   - Waiting room
   - Promotional materials
5. Patients scan the QR code with their phone camera
6. They're automatically redirected to the booking page

## Technology Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with custom blue theme
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **QR Code**: qrcode.react

## Color Scheme

The application uses a professional blue and white color scheme:
- Primary: Sky Blue (#0369a1)
- Accent: Cyan (#0891b2)
- Background: Light Blue gradients (#f0f9ff, #f0fdfa)
- Text: Slate shades for optimal readability

## Default Appointment Slots

**Operating Days**: Monday - Friday
**Operating Hours**: 9:00 AM - 5:00 PM
**Slot Duration**: 30 minutes

Available slots:
- 09:00, 09:30, 10:00, 10:30, 11:00, 11:30
- 12:00, 12:30, 13:00, 13:30, 14:00, 14:30
- 15:00, 15:30, 16:00, 16:30

## Consultation Types

1. General Consultation
2. Follow-up
3. Specialist Consultation
4. Emergency

## Support

For issues or questions about the system, refer to the code documentation or contact your system administrator.
