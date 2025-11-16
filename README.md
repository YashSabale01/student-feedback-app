# Student Feedback Form

ExpressJS web application with server-side validation and MongoDB integration.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB locally

3. Run the application:
```bash
npm start
```

4. Open http://localhost:3001

## Deployment

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 3001)

### Deploy to Heroku
```bash
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
git push heroku main
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```