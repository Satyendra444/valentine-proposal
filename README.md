# 💕 Valentine's Day Proposal App

A beautiful, interactive Valentine's Day proposal application built with React and integrated with a romantic API backend. Create magical, personalized proposals with stunning animations, image uploads, payment processing, and shareable magic links!

## ✨ Features

- **Beautiful Landing Page** - Eye-catching design with floating hearts and animations
- **Personalized Proposals** - Custom messages, photos, and romantic content with real image uploads
- **Interactive Proposal View** - Animated responses with playful reject button behavior
- **Real Payment Integration** - Razorpay payment processing (₹29) with multiple payment methods
- **Magic Links** - Secure shareable proposal links with access tokens
- **Image Upload** - ImageKit.io integration for beautiful photo storage
- **Email Capture** - Sender email collection for notifications
- **Responsive Design** - Works perfectly on all devices
- **Pink Valentine Theme** - Romantic color scheme throughout

## 🚀 Getting Started

### Prerequisites

Make sure you have the Valentine's Day Proposal API backend running on `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Razorpay Configuration (Required for payments)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to the local development URL

**Note:** The app includes an environment variable checker in development mode (top-right corner) to help verify your configuration.

## 📱 How It Works

1. **Landing Page** - Beautiful introduction with features overview
2. **Create Proposal** - Fill out form with sender/recipient details, email, message, and optional photo
3. **API Integration** - Form data and image uploaded to backend via API
4. **Payment Processing** - Real Razorpay integration for secure payments
5. **Magic Link Generation** - Backend generates unique shareable links
6. **Access Token** - Generated after successful payment for viewing proposals
7. **Proposal View** - Interactive page where your Valentine responds
8. **Celebration** - Beautiful animation when they say "Yes!"

## 🔗 API Integration

The app integrates with the Valentine's Day Proposal API with the following endpoints:

### Proposals
- `POST /api/proposals/create` - Create new proposal with form data and image upload
- `GET /api/proposals/magic/{magic_link}` - Get proposal by magic link (for payment page)
- `GET /api/proposals/view/{token}` - View proposal with access token (after payment)

### Payments
- `POST /api/payments/create-razorpay-order` - Create Razorpay order for payment
- `POST /api/payments/verify-razorpay` - Verify Razorpay payment signature
- `GET /api/payments/status/{proposal_id}` - Check payment status and get access token

### Features Supported
- ✅ Multipart form data with image uploads
- ✅ ImageKit.io integration for image storage
- ✅ Razorpay payment processing with multiple payment methods
- ✅ Magic link generation
- ✅ Access token system
- ✅ Email capture
- ✅ Error handling and validation

## 🎨 Design Features

- Gradient pink backgrounds
- Floating heart animations
- Interactive hover effects
- Responsive grid layouts
- Beautiful typography
- Smooth transitions
- Loading states and error handling

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **React Router** - Client-side routing with multiple proposal view routes
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **CSS3** - Custom styling with CSS variables
- **Fetch API** - HTTP client for API integration
- **FormData** - Multipart form handling for file uploads

## 💖 Special Features

- **Playful Reject Button** - Moves around when clicked 100+ times with cute messages!
- **Heart Animations** - Click anywhere to create floating hearts
- **Celebration Mode** - Confetti and GIF when proposal is accepted
- **Real Backend Integration** - Full API integration with Razorpay payments
- **Image Upload** - Beautiful image preview and upload functionality
- **Payment Flow** - Complete Razorpay payment processing with success modals
- **Magic Link Sharing** - Copy and share functionality with native share API

**Important:** 
- Get your Razorpay Key ID from your Razorpay dashboard
- Use test keys for development (`rzp_test_...`)
- Use live keys for production (`rzp_live_...`)
- The app will show an environment checker in development mode

## 🔄 API Service

The app includes a comprehensive API service (`src/services/api.js`) that handles:

- Proposal creation with multipart form data
- Image upload handling
- Payment intent creation
- Payment status checking
- Proposal retrieval by magic link or access token
- Error handling and response parsing

## 📝 Routes

- `/` - Landing page
- `/create` - Proposal creation form
- `/payment` - Payment processing page
- `/proposal/view/{token}` - View proposal with access token (after payment)
- `/proposal/magic/{magicLink}` - Payment page via magic link
- `/proposal/{id}` - Legacy route for backward compatibility

## 🚨 Error Handling

The app includes comprehensive error handling for:
- API connection failures
- Invalid proposal URLs
- Payment processing errors
- Image upload failures
- Network timeouts

## 💕 Perfect for Valentine's Day!

Create unforgettable memories with this magical proposal experience backed by a robust API!