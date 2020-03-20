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
              a(role="button" @click="getPlaylistAndScroll([playlist.id, playlist.name])") {{ playlist.name }}

      transition(name="slide-fade")
        div.page__cards(v-if="playlistActive && hasTracks")
          .page__card
            .page__card-heading
              h2 {{ activePlaylist.name }}
              h5 (based on the first 50 tracks...)
            ul.page__analysis
              li
                strong Average Happiness:
                p {{ avgHappiness }}
                .page__emoji {{ happinessEmoji }}
              li
                strong Average Danciness:
                p {{ avgDanciness }}
                .page__emoji(:class="{ 'page__emoji--crossed': avgDanciness < 0.5 }")
                  | 💃
              li
                strong Average Tempo:
                p {{ avgTempo }} bpm
              li
                strong Average Track Length:
                p {{ avgLength }}
              li
                strong Song Popularity:
                p {{ popularity }}

          .page__card
            .page__selected-playlist
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
      button(v-show="playlistActive" @click="clearPlaylistAndScroll") Back
      button(v-if="showMoreButton" @click="getMoreTracks(activePlaylist.next)") More

      .page__card
        .page__disclaimer
          h4.page__small-header Notes :
          ul
            li.page__list-item This is mostly for fun, this data doesn't actually appear to be super accurate i.e. bpm values often have 3 decimal places
            li.page__list-item  {{ 'Ratings like happiness are based on valence, which is a Spotify algorithm. More information can be found ' }}
              a(href='https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/') here
            li.page__list-item  This was built by tkdallman@gmail.com using VueJS and Nuxt
</template>
`
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
    },
    totalTracks () {
      return Object.keys(this.playlistTrackData).length
    },
    hasTracks () {
      return this.totalTracks > 0
    },
    avgHappiness () {
      if (!this.hasTracks) { return false }
      const happiness = Object.keys(this.playlistTrackData).reduce((sum, item) => {
        return (sum += this.playlistTrackData[item].valence)
      }, 0) / this.totalTracks
      return happiness.toFixed(3) || null
    },
    happinessEmoji () {
      const emoji = this.happiness < 0.333
        ? '😔' : this.happiness < 0.666 ? '😐' : '😊'
      return emoji
    },
    avgDanciness () {
      if (!this.hasTracks) { return false }
      const danciness = Object.keys(this.playlistTrackData).reduce((sum, item) => {
        return (sum += this.playlistTrackData[item].danceability)
      }, 0) / this.totalTracks
      return danciness.toFixed(3) || null
    },
    avgTempo () {
      if (!this.hasTracks) { return false }
      const tempo = Object.keys(this.playlistTrackData).reduce((sum, item) => {
        return (sum += this.playlistTrackData[item].tempo)
      }, 0) / this.totalTracks
      return Math.round(tempo) || null
    },
    avgLength () {
      if (!this.hasTracks) { return false }
      const length = Object.keys(this.playlistTrackData).reduce((sum, item) => {
        return (sum += this.playlistTrackData[item].duration_ms)
      }, 0) / this.totalTracks

      const minutes = Math.floor(length / 60000)
      const seconds = ((length % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    },
    popularity () {
      if (this.totalTrack === 0) { return false }
      const popularity = this.activePlaylist.items.reduce((sum, item) => {
        return (sum += item.track.popularity)
      }, 0) / this.totalTracks
      return popularity < 20
        ? 'super underground, man'
        : popularity < 50 ? 'indie' : 'mainstream'
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
      // dev mode
      // window.location.href = 'https://accounts.spotify.com/authorize?client_id=c1d9eac11b924974befb50e216500a9a&redirect_uri=http:%2F%2Flocalhost:3000&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-read-collaborative&response_type=token'
      // production
      window.location.href = 'https://accounts.spotify.com/authorize?client_id=c1d9eac11b924974befb50e216500a9a&redirect_uri=https:%2F%2Ftkdallman.github.io%2Fspotify-playlist-analyzer%2F&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-read-collaborative&response_type=token'
    },
    changeSort (e) {
      this.sortPlaylist(e.target.value)
    },
    getPlaylistAndScroll (args) {
      window.scrollTo(0, 0)
      this.getPlaylist(args)
    },
    clearPlaylistAndScroll () {
      window.scrollTo(0, 0)
      this.clearActivePlaylist()
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
  position: relative;
  list-style-type: none;
  padding-left: 0;
}

li {
  font-size: 14px;
}

a {
  cursor: pointer;
}

h2 {
  margin: 16px 0 4px;
  font-weight: 900;
  letter-spacing: 1px;
}

h4 {
  margin: 0 16px;
}

h5 {
  margin-bottom: 8px;
}

select {
  font-size: 16px;
}

button {
  cursor: pointer;
  padding: 16px 20px;
  border-color: #191414;
  background-color: #1DB954;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 500;
  color: #f0e7e7;

  &:active, &:focus {
    outline: none;
    border: none;
  }
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
    justify-content: flex-end;
    margin: 16px 16px;
  }

  &__card {
    background-color: #e5e3e6;
    margin: 32px 16px 32px;
    border: 2px solid grey;
    padding-bottom: 8px;
  }

  &__card-heading {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin: 16px 16px 0;

    h2 {
      margin-top: 16px;
      font-size: 36px;
      letter-spacing: 2.4px;
    }

    h5 {
      margin-bottom: 16px;
    }
  }

  &__analysis {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    li, strong {
      font-family: monospace;
      font-size: 1.2rem;
    }

    li {
      display: flex;
      flex-direction: column;
      // background: lightgrey;
      border: 1px solid grey;
      flex-basis: calc(50% - 24px);
      padding: 12px;
      margin: 10px 8px;
    }

    p {
      font-family: monospace;
    }
  }

  &__emoji {
    font-size: 2rem;
    position: relative;

    &--crossed {
      &:before {
        content: 'X';
        position: absolute;
        color: #1DB954;
        font-size: 3rem;
        bottom: -6px;
      }
    }
  }

  &__buttons {
    min-height: 60px;
  }

  &__track {
    margin-bottom: 20px;
  }

  &__playlist {
    font-weight: 700;
    padding: 0 16px;

    a {
      font-size: 1rem;
      font-family: monospace;
      padding: 16px;
      width: 100%;
      height: 100%;
      display: block;
      letter-spacing: 0.8px;
      transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);

      &:hover {
        transform: scale(1.1);
      }
    }

    &:nth-child(odd) {
      background-color: #d4d0d6;
    }
  }

  &__disclaimer {
    margin: 16px;
    text-align: left;

    h4 {
      margin-bottom: 20px;
    }

    * {
      font-family: monospace;
    }
  }

  &__list-item {
    padding-left: 20px;
    margin-bottom: 24px;

    &:before {
      content: '🎵';
      position: absolute;
      left: 0;
    }
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

// .slide-fade-leave-to {
//   // transform: translateX(200px);
//   opacity: 0;

.slide-top-enter-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-top-enter, .slide-top-leave-to  {
  opacity: 0;
}

</style>
