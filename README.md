# SyncDoc - AI-Powered Healthcare Assistant

SyncDoc is an AI-powered healthcare web application designed for doctors to streamline patient consultations. The platform features real-time audio recording, automatic transcription, and intelligent prescription generation using advanced AI models.

## Features

- **Real-time Audio Recording**: Record patient consultations with high-quality audio capture
- **AI-Powered Transcription**: Automatic speech-to-text conversion using Google Cloud Speech-to-Text
- **Intelligent Prescription Generation**: AI-assisted prescription creation based on consultation content
- **Patient Management**: Comprehensive patient records and consultation history
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Secure Authentication**: Role-based access control for healthcare professionals

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Backend**: Python Flask
- **AI Services**: Google Cloud Speech-to-Text, Gemini Pro
- **State Management**: React Context API
- **Animations**: GSAP

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Google Cloud Account (for Speech-to-Text and Gemini Pro APIs)
- Virtual environment tool (venv or conda)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv myenv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     myenv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source myenv/bin/activate
     ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up Google Cloud credentials:
   - Create a Google Cloud project
   - Enable the Speech-to-Text API and Gemini API
   - Create a service account and download the JSON key file
   - Rename the file to `google_creds.json` and place it in the backend directory
   - Update the `.env` file with your Gemini API key

6. Start the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Environment Variables

### Backend (.env file in backend directory)
```env
FLASK_ENV=development
SECRET_KEY=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=google_creds.json
PORT=5000
```

### Frontend (.env file in frontend directory)
```env
VITE_API_URL=/api
```

## Security Notes

For security reasons, the following files are excluded from version control:
- `backend/google_creds.json` - Google Cloud service account credentials
- `backend/.env` - Environment variables with API keys

Template files are provided to help with setup:
- `backend/google_creds_template.json` - Template for Google Cloud credentials

## API Endpoints

- **Transcription**: `POST /api/transcribe`
- **Prescription Generation**: `POST /api/generate-prescription`
- **Patient Management**: `GET/POST/PUT /api/patients/*`

## Project Structure

```
.
├── backend/
│   ├── services/           # AI service integrations
│   ├── myenv/              # Python virtual environment
│   ├── data/               # Data storage
│   ├── app.py              # Main Flask application
│   ├── auth.py             # Authentication logic
│   ├── storage.py          # Data storage utilities
│   ├── utils.py            # Utility functions
│   ├── .env                # Environment variables (not in repo)
│   ├── google_creds.json   # Google credentials (not in repo)
│   └── requirements.txt    # Python dependencies
└── frontend/
    ├── public/             # Static assets
    ├── src/
    │   ├── components/     # React components
    │   ├── context/        # React context providers
    │   ├── hooks/          # Custom React hooks
    │   ├── lib/            # Utility functions
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   ├── App.tsx         # Main app component
    │   ├── main.tsx        # Entry point
    │   └── vite-env.d.ts   # Vite types
    ├── index.html          # HTML template
    ├── vite.config.ts      # Vite configuration
    └── tailwind.config.ts  # Tailwind CSS configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Deployment

### GitHub Pages Deployment

1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

### Manual Deployment

1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```

2. The built files will be in the `dist` directory, which can be deployed to any static hosting service.

### Environment for Production

Make sure to set the appropriate environment variables for your production environment:
- `VITE_API_URL` should point to your backend API URL

## License

This project is licensed under the MIT License.