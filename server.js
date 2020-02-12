const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const hbs = require("hbs");

app.use(express.static("public"));

hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// app.set('view engine', 'html');
// app.engine('html', require('hbs').__express);

app.get("/", (request, response) => {
  let dt = new Date();
  let data = {
    projectName: process.env.PROJECT_DOMAIN,
    serverTime: new Date(),
    ip: (request.headers["x-forwarded-for"] || "").split(",")[0]
  };

  data.json = JSON.stringify(data, null, 2);
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
  // spotifyApi
  //   .getUserPlaylists(req.params.user, { limit: 50, offset: 0 })
  //   .then(data => {
  //     res.render("user", {
  //       title: req.params.user,
  //     });
  //   });
});

app.get("/api/user/:user", function(req, res) {
  res.header("Content-Type", "application/json");

  spotifyApi
    .getUserPlaylists(req.params.user, { limit: 50, offset: 0 })
    .then(data => res.send(data));
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
