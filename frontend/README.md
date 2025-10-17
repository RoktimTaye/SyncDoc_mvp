# SyncDoc - AI-Powered Healthcare Assistant

This is a [Lovable](https://lovable.dev) project. 

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Features

- **Real-time Audio Recording**: Record patient consultations with high-quality audio capture
- **AI-Powered Transcription**: Automatic speech-to-text conversion using advanced AI models
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

## Development

To start the development server:

```bash
npm run dev
```

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── App.tsx       # Main app component
│   ├── main.tsx      # Entry point
│   └── vite-env.d.ts # Vite types
├── index.html        # HTML template
├── vite.config.ts    # Vite configuration
└── tailwind.config.ts # Tailwind CSS configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.