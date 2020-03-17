<template lang="pug">
  .page
    .page__container
      h1.page__title Spotify Playlist Analyzer

      .page__buttons
        button(v-if="!isLoggedIn" @click="authorizeUser") Authorize
        transition(name="slide-top")
          button(v-show="playlistActive" @click="clearActivePlaylist") Back

      transition(name="slide-fade")
        .page__card(v-if="!playlistActive")
          ul.page__playlists
            li.page__playlist(v-for="playlist in playlists")
              a(role="button" @click="getPlaylist(playlist.id)") {{ playlist.name }}

      transition(name="slide-fade")
        .page__card(v-if="playlistActive")
          .page__selected-playlist
            //- h1 Playlist
            .page__sort
              h4 Sort:
              select#SortBy(@change="changeSort")
                option Select a method...
                option Key
                option Tempo
                option Energy
                option Danceability
            ul.page__tracks(v-for="(song, index) in activePlaylist.items")
              Song(:song="song" :darkTheme="index % 2 !== 0")
      button(v-show="playlistActive" @click="clearActivePlaylist") Back
      button(v-if="showMoreButton" @click="getMoreTracks(activePlaylist.next)") More

      .page__card
        .page__disclaimer
          h4 Notes :
          ul
            li 🎵 This is mostly for fun, this data doesn't actually appear to be super accurate
            li 🎵 BPM values have been rounded
            li 🎵 Other ratings are proprietary algorithms that are made by Spotify
            li 🎵 i.e. valence, which is an approximation of a song's mood - 0 being sad, 1 being happy
</template>

<script>
import { mapState, mapActions } from 'Vuex'
import Logo from '~/components/Logo.vue'
import ContentBlock from '~/components/ContentBlock.vue'
import Song from '~/components/Song.vue'

export default {
  components: {
    Logo,
    ContentBlock,
    Song
  },
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      isLoggedIn: state => state.isLoggedIn,
      playlists: state => state.playlists,
      activePlaylist: state => state.activePlaylist,
      playlistTrackData: state => state.playlistTrackData
    }),
    playlistActive () {
      return this.activePlaylist && this.activePlaylist.items
    },
    showMoreButton () {
      return this.activePlaylist && this.activePlaylist.next
    }
  },
  mounted () {
    if (this.$route.hash) {
      this.setAccessToken(this.$route.hash)
      this.getPlaylists()
    }
  },
  methods: {
    ...mapActions([
      'setAccessToken',
      'getPlaylists',
      'getPlaylist',
      'sortPlaylist',
      'getMoreTracks',
      'clearActivePlaylist'
    ]),
    authorizeUser () {
      window.location.href = 'https://accounts.spotify.com/authorize?client_id=c1d9eac11b924974befb50e216500a9a&redirect_uri=http:%2F%2Flocalhost:3000&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-read-collaborative&response_type=token'
    },
    changeSort (e) {
      this.sortPlaylist(e.target.value)
    }
  }
}
</script>

<style lang="scss">

* {
  font-family: "Helvetica Neue", "Helvetica", sans-serif
}

html {
  background-color: #2c3134;
  color: #2c3134;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  font-size: 14px;
}

a {
  cursor: pointer;
}

h4 {
  margin: 0 16px 8px;
}

select {
  font-size: 16px;
}

button {
  padding: 16px 20px;
  border-color: #191414;
  background-color: #1DB954;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 500;
  color: #f0e7e7;
}

.page {
  &__container {
    max-width: 600px;
    margin: 20px auto 0;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  &__title {
    font-family: 'Helvetica', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 500;
    font-size: 48px;
    letter-spacing: 20px;
    margin-bottom: 32px;
    color: #e5e3e6;
  }

  &__sort {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
  }

  &__card {
    background-color: #e5e3e6;
    margin: 32px 16px 32px;
    border: 2px solid grey;
  }

  &__buttons {
    min-height: 60px;
  }

  &__track {
    margin-bottom: 20px;
  }

  &__playlist {
    font-weight: 700;

    a {
      padding: 16px 12px;
      width: 100%;
      height: 100%;
      display: block;
      letter-spacing: 0.6px;
    }

    &:nth-child(odd) {
      background-color: #d4d0d6;
    }
  }

  &__disclaimer {
    margin: 16px;
    text-align: left;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .4s ease-in;
}

.slide-fade-enter, .slide-fade-leave-to {
  // transform: translateX(200px);
  opacity: 0;
}

.slide-top-enter-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-top-enter, .slide-top-leave-to  {
  opacity: 0;
}

</style>
