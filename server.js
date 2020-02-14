const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const hbs = require("hbs");

const { flattenObject } = require("./lib/utils");

app.use(express.static("public"));

hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// for using .html instead of .hbs
// app.set('view engine', 'html');
// app.engine('html', require('hbs').__express);

app.get("/", (request, response) => {
  let dt = new Date();
  let data = {
    projectName: process.env.PROJECT_DOMAIN
  };
  response.render("index", data);
});

app.set("json spaces", 2);

// spotify authorization
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

app.get("/user/:user", function(req, res) {
  res.render("user", {
    projectName: process.env.PROJECT_DOMAIN,
    user: req.params.user
  });
});

app.get("/api/test/:param", function(req, res) {
  res.header("Content-Type", "application/json");

  //3Qm86XLflmIXVm1wcwkgDK
  spotifyApi.getAudioAnalysisForTrack(req.params.param).then(function(data) {
    res.send(data.body);
  });
});

app.get("/api/playlist/:id/tracks", function(req, res) {
  res.header("Content-Type", "application/json");
  const tracks = [];
  const options = {
    fields:
      "next,total,offset,items(added_at, track(id,name,artists(name,id),popularity))",
    // "next,total,offset,items(added_at, track(id,name,artists(name,id),popularity,type,external_urls(spotify), preview_url),album(images))",
    limit: 100
  };

  spotifyApi
    .getPlaylistTracks(req.params.id, { ...options, ...req.query })
    .then(data => res.send({ ...req.query, ...data.body }));
});

app.get("/api/user/:user", function(req, res) {
  res.header("Content-Type", "application/json");

  spotifyApi
    .getUserPlaylists(req.params.user, { limit: 50, offset: 0 })
    .then(function(data) {
      res.send(data);
    });
});


const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
