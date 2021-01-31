# Spotify Playlist Analyzer

## What is this?

This is a Spotify Playlist Analyzer, it makes an API authentication request with Spotify and retrieves the user playlist data. When a playlists is clicked it gives a more detailed description of the playlist including average tempo, song length, and some more fun data from Happiness, which is derived from Spotify's calculation for a song's _valence_. More info about Spotify's algorithms [here](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/).

There is a live demo available here: https://tkdallman.github.io/spotify-playlist-analyzer/

It was made with Vue.js and Nuxt with Vuex for state management

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# pushes to GH pages
$ npm deploy
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
