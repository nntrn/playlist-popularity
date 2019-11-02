const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
 
// // parse application/json
// app.use(bodyParser.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// // in latest body-parser use like below.
// app.use(bodyParser.urlencoded({ extended: true }));
 

// app.set('json spaces', 2)

// -------------------------------------------------------------//
// ----------------------- AUTHORIZATION -----------------------//
// -------------------------------------------------------------//

// Initialize Spotify API wrapper
const SpotifyWebApi = require('spotify-web-api-node')

// The object we'll use to interact with the API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

// Using the Client Credentials auth flow, authenticate our app
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token'])
    console.log('Got an access token: ' + spotifyApi.getAccessToken())

  }, function (err) {
    console.log(err)
  })

// -------------------------------------------------------------//
// ------------------------- API CALLS -------------------------//
// -------------------------------------------------------------//

app.get('/search-track', function (req, res) {

  // Search for a track!
  spotifyApi.searchTracks('track:Dancing Queen', {limit: 1})
    .then(function (data) {

      // Send the first (only) track object
      res.send(data.body.tracks.items[0])

    }, function (err) {
      console.error(err)
    })
})

app.post('/user-playlist', function (req, res) {
// res.send(req.body)
  
  spotifyApi.getUserPlaylists( req.body.user)
    .then(function (data) {  
    
      res.send(data)
    }, function (err) {
      console.error(err)
    })

})

app.get('/category-playlists', function (req, res) {
  
  spotifyApi.getPlaylistsForCategory('jazz', {limit: 5})
    .then(function (data) {

      // Send the list of playlists
      res.send(data.body.playlists)

    }, function (err) {
      console.error(err)
    })
})

app.get('/audio-features', function (req, res) {

  // Get the audio features for a track ID
  spotifyApi.getAudioFeaturesForTrack('4uLU6hMCjMI75M1A2tKUQC')
    .then(function (data) {

      // Send the audio features object
      res.send(data.body)

    }, function (err) {
      console.error(err)
    })
})

app.get('/artist', function (req, res) {

  // Get information about an artist
  spotifyApi.getArtist('6jJ0s89eD6GaHleKKya26X')
    .then(function (data) {

      // Send the list of tracks
      res.send(data.body)

    }, function (err) {
      console.error(err)
    })
})

app.get('/artist-top-tracks', function (req, res) {

  // Get an artist's top tracks in a country
  spotifyApi.getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV', 'SE')
    .then(function (data) {

      // Send the list of tracks
      res.send(data.body.tracks)

    }, function (err) {
      console.error(err)
    })
})

// -------------------------------------------------------------//
// ------------------------ WEB SERVER -------------------------//
// -------------------------------------------------------------//

// Listen for requests to our app
// We make these requests from client.js
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
