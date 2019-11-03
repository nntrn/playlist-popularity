const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.set("json spaces", 2);

// -------------------------------------------------------------//
// ----------------------- AUTHORIZATION -----------------------//
// -------------------------------------------------------------//

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant().then(
  function(data) {
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
  const limit = req.query.limit || 50;

  let offset =
    req.query.offset || (req.query.page && req.query.page * limit) || 0;


  spotifyApi.searchPlaylists(keyword, { limit: limit, offset: offset }).then(
    function(data) {
      // Object.assign(data.body, { api: req.url });
      res.send(data.body);
    },
    function(err) {
      console.error(err);
    }
  );
});

// -------------------------------------------------------------//
// ------------------------ WEB SERVER -------------------------//
// -------------------------------------------------------------//

// Listen for requests to our app
// We make these requests from client.js
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
