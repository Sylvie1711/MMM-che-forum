# CHE MMMUT Forum

A forum website for the Chemical Engineering Department at MMMUT, built with Next.js and Tailwind CSS.

## Features

- Create and view posts in different categories
- Comment on posts
- Filter posts by category
- Responsive design
- No authentication required - anyone can post and comment

## Tech Stack

- Next.js 14
- Tailwind CSS
- Node.js
- File-based data storage (development)
- In-memory data storage (production)

## Data Storage

- **Development**: The application uses a file-based storage system that saves data to JSON files in the `/data` directory.
- **Production**: When deployed to platforms like Vercel, the application uses an in-memory data store that persists for the lifetime of the server instance. Note that data will be reset when the server restarts in production.

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Sylvie1711/MMM-che-forum.git
cd MMM-che-forum
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env.local`
- Update the `MONGODB_URI` with your MongoDB connection string

4. Run the development server:
```bash
npm run dev
```

## Deployment

1. Set up MongoDB:
- Create a MongoDB Atlas account
- Create a new cluster
- Get your connection string
- Add your connection string to the environment variables

2. Deploy to Vercel:
- Fork this repository
- Create a new project on Vercel
- Connect your GitHub repository
- Add the environment variables in Vercel:
  - `MONGODB_URI`: Your MongoDB connection string
- Deploy!

Note: The deployed application will use in-memory data storage. This means data will not persist between deployments or if the server restarts.

## Contributing

Feel free to open issues and pull requests!
