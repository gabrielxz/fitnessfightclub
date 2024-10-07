require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
const host = '0.0.0.0';  // Make sure to bind to 0.0.0.0 for Cloud9


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = process.env.STRAVA_REDIRECT_URI;

// Route to display the authorization button
app.get('/', (req, res) => {
  res.render('index', { clientId: STRAVA_CLIENT_ID });
});

// Callback route after Strava authorization
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: STRAVA_REDIRECT_URI,
    });

    const accessToken = tokenResponse.data.access_token;

    // Save the token or use it to fetch data
    res.send('Authorization successful! Access Token: ' + accessToken);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during authorization process.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
