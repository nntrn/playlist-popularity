const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const hbs = require("hbs");

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

function getTracks(id) {
  var tracks = [];

    const options = {
      fields:
        "next,total,offset,items(added_at, track(id,name,popularity,type,external_urls(spotify),preview_url),album(images))",
      // limit: 100,
      // offset: (function() {
      //   return tracks.length;
      // })()
    };

    spotifyApi.getPlaylistTracks(id, options)
      .then(data=>tracks.push(data.items))

  return tracks;
}

app.get("/api/playlist/:id", function(req, res) {
  res.header("Content-Type", "application/json");
  const tracks = []
      const options = {
      fields:
        "next,total,offset,items(added_at, track(id,name,popularity,type,external_urls(spotify),preview_url),album(images))",
      limit: 100,
      offset: (function() {
        return tracks.length;
      })()
    };
  

  spotifyApi.getPlaylistTracks(req.params.id, { limit: 100 }).then(
    function(data) {
      // res.send(data);
      tracks.push(data)
    },
    function(err) {
      console.log(err);
    }
  );
  
});

app.get("/api/user/:user", function(req, res) {
  res.header("Content-Type", "application/json");

  spotifyApi.getUserPlaylists(req.params.user, { limit: 50, offset: 0 }).then(
    function(data) {
      res.send(data);
    },
    function(err) {
      console.log(err);
    }
  );
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
