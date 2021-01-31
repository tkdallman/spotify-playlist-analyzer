<template lang="pug">
  .page
    .page__container
      h1.page__title Spotify Playlist Analyzer

      .page__buttons(v-if="!isLoggedIn || playlistActive")
        Button(v-if="!isLoggedIn" :text="'Authorize'" :clickFn="authorizeUser")
        transition(name="slide-top")
          Button(v-if="playlistActive" :text="'Back'" :clickFn="clearActivePlaylist")

      // Playlists view

      transition(name="slide-fade")
        Card(v-if="!playlistActive && playlists.length > 0")
          ItemList(:items="playlists" :clickFn="getPlaylistAndScroll")

      // Single playlist view

      transition(name="slide-fade")
        .page__cards(v-if="playlistActive && hasTracks || showErrorMessage")

          // if error
          Card(v-if="showErrorMessage")
            Error

          // Playlist Details
          DetailsCard(v-if="hasTracks")

          // Individual song stats
          SongsCard

      Button(v-show="playlistActive" :text="'Back'" :clickFn="clearPlaylistAndScroll")
      Button(v-if="showMoreButton" :text="'More'" :clickFn="getMoreTracks(activePlaylist.next)")

      FooterCard
</template>
`
<script>
import { mapState, mapActions } from 'Vuex'
import Logo from '~/components/Logo.vue'
import Button from '~/components/Button'
import Card from '~/components/Card'
import DetailsCard from '~/components/DetailsCard'
import SongsCard from '~/components/SongsCard'
import FooterCard from '~/components/FooterCard'
import ItemList from '~/components/ItemList'
import Error from '~/components/Error.vue'

export default {
  components: {
    Logo,
    Button,
    Card,
    DetailsCard,
    SongsCard,
    FooterCard,
    ItemList,
    Error
  },
  async fetch ({ store, route }) {
    if (route.hash) {
      store.dispatch('setAccessToken', route.hash)
      await store.dispatch('getPlaylists')
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      isLoggedIn: state => state.isLoggedIn,
      playlists: state => state.playlists,
      activePlaylist: state => state.activePlaylist,
      playlistTrackData: state => state.playlistTrackData,
      showErrorMessage: state => state.showErrorMessage
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
    }
  },
  head () {
    return {
      title: 'Spotify Playlist Analyzer',
      meta: [
        { hid: 'description', name: 'description', content: 'A Spotify Playlist Analyzer built by TK Dallman' }
      ]
    }
  },
  methods: {
    ...mapActions([
      'setAccessToken',
      'getPlaylists',
      'getPlaylist',
      'getMoreTracks',
      'clearActivePlaylist'
    ]),
    authorizeUser () {
      // dev mode
      window.location.href = 'https://accounts.spotify.com/authorize?client_id=c1d9eac11b924974befb50e216500a9a&redirect_uri=http:%2F%2Flocalhost:3000&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-read-collaborative&response_type=token'
      // production
      // window.location.href = 'https://accounts.spotify.com/authorize?client_id=c1d9eac11b924974befb50e216500a9a&redirect_uri=https:%2F%2Ftkdallman.github.io%2Fspotify-playlist-analyzer%2F&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-read-collaborative&response_type=token'
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
