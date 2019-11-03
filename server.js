const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json())

app.use(bodyParser.json());

app.set("json spaces", 2);

// -------------------------------------------------------------//
// ----------------------- AUTHORIZATION -----------------------//
// -------------------------------------------------------------//

// The object we'll use to interact with the API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Using the Client Credentials auth flow, authenticate our app
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Got an access token: " + spotifyApi.getAccessToken());
  },
  function(err) {
    console.log(err);
  }
);

// -------------------------------------------------------------//
// ------------------------- API CALLS -------------------------//
// -------------------------------------------------------------//

app.get("/user-playlist", function(req, res) {
  spotifyApi.getUserPlaylists(req.query.user, { limit: 50, offset: 0 }).then(
    function(data) {
      res.send(data.body);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/search-playlist", function(req, res) {
  const keyword = req.query.keyword || "chill";
  const limit = 50;

  let offset =
    req.query.offset || (req.query.page && req.query.page * limit) || 0;

  console.log(req.url);
  console.log(req.client);

  spotifyApi.searchPlaylists(keyword, { limit: limit, offset: offset }).then(
    function(data) {
      Object.assign(data.body.playlists, { api: req.url });
      res.send(data.body.playlists);
    },
    function(err) {
      console.error(err);
    }
  );
});

// spotifyApi.searchPlaylists('workout')
//   .then(function(data) {
//     console.log('Found playlists are', data.body);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });

// -------------------------------------------------------------//
// ------------------------ WEB SERVER -------------------------//
// -------------------------------------------------------------//

// Listen for requests to our app
// We make these requests from client.js
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
