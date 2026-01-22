# Heroku Deployment Guide - DairyDash Backend

## Step-by-Step Deployment Instructions

This guide will help you deploy the DairyDash backend to Heroku for production use.

### Prerequisites
1. A Heroku account (free tier available at https://www.heroku.com)
2. Heroku CLI installed on your machine (https://devcenter.heroku.com/articles/heroku-cli)
3. Git installed
4. GitHub repository access

### Quick Deployment Steps

#### 1. Sign Up/Log In to Heroku
- Go to https://www.heroku.com and create an account or sign in
- Verify your email address

#### 2. Create a New Heroku App
- Go to https://dashboard.heroku.com/apps
- Click "New" button
- Select "Create new app"
- Enter app name: `dairydash-backend` (or any unique name)
- Choose region: United States or Europe
- Click "Create app"

#### 3. Set Environment Variables (Config Vars)
- Go to your app's Settings tab
- Under "Config Vars", click "Reveal Config Vars"
- Add these environment variables:
  - KEY: `NODE_ENV` → VALUE: `production`
  - KEY: `PORT` → VALUE: `5000` (or your preferred port)
  - KEY: `MONGODB_URI` → VALUE: `your_mongodb_connection_string` (if using MongoDB)
  - KEY: `JWT_SECRET` → VALUE: `your_secure_jwt_secret_key`
  - KEY: `CORS_ORIGIN` → VALUE: `https://ayushjhaa1187-spec.github.io`

#### 4. Connect GitHub Repository
- In your Heroku app dashboard, go to "Deploy" tab
- Choose "GitHub" as deployment method
- Click "Connect to GitHub"
- Search for your repository: `DairyDash-Dairy-Platform.-`
- Click "Connect"

#### 5. Deploy
- Scroll to "Manual deploy" section
- Click "Deploy Branch"
- Wait for deployment to complete (you'll see build logs)
- Once complete, you'll see "Your app was successfully deployed"

#### 6. Verify Deployment
- Click "View" button or go to your app URL (e.g., https://dairydash-backend.herokuapp.com)
- Test your API endpoints

### Troubleshooting

#### Issue: Build fails
- Check that package.json is in the backend folder
- Ensure all dependencies are listed in package.json
- Check the build logs for specific errors

#### Issue: App crashes after deployment
- Check app logs: `heroku logs --tail` (if using CLI)
- Or view logs in the app dashboard under "More" → "View logs"
- Verify all environment variables are set correctly
- Check that server.js is configured to use process.env.PORT

#### Issue: Port binding error
- Ensure server listens on: `process.env.PORT || 5000`

### Updating Your Deployment
After making changes to your code:
1. Push changes to GitHub: `git push origin main`
2. Heroku will automatically redeploy if auto-deploy is enabled
3. Or manually deploy from the Deploy tab

### Database Configuration
For MongoDB:
- Use MongoDB Atlas (free tier available)
- Get connection string from MongoDB Atlas
- Add to Heroku Config Vars as MONGODB_URI

For Other Databases:
- Update connection string in Config Vars
- Ensure backend code uses environment variables

### API Endpoints After Deployment
Your API will be available at: `https://your-app-name.herokuapp.com`

Example endpoints:
- `https://your-app-name.herokuapp.com/api/products`
- `https://your-app-name.herokuapp.com/api/orders`
- `https://your-app-name.herokuapp.com/api/delivery`

### Frontend Integration
Update your frontend API base URL to your Heroku app URL:
```javascript
const API_BASE_URL = 'https://your-app-name.herokuapp.com/api';
```

### Security Best Practices
1. Never commit .env files to GitHub
2. Use strong JWT secrets (minimum 32 characters)
3. Enable HTTPS (Heroku provides this automatically)
4. Use CORS to allow only your frontend domain
5. Validate all user inputs on the backend
6. Use environment variables for sensitive data

### Monitoring
- View app metrics in the "Resources" tab
- Monitor logs regularly for errors
- Set up alerts for downtime (Heroku Scheduler)

### Support
For more help:
- Heroku Documentation: https://devcenter.heroku.com
- Node.js on Heroku: https://devcenter.heroku.com/articles/nodejs-support
- GitHub Issues: Check project issues for common problems
