<template lang='pug'>
  Card
    .card__header
      h2.card__heading {{ activePlaylist.name ? activePlaylist.name : '' }}
      h5.card__subheading (based on the first 50 tracks...)
    ul.card__content-box
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
</template>

<script>
import { mapState } from 'Vuex'
import Card from '~/components/Card'

export default {
  components: {
    Card
  },
  computed: {
    ...mapState({
      activePlaylist: state => state.activePlaylist,
      playlistTrackData: state => state.playlistTrackData
    }),
    totalTracks () {
      return Object.keys(this.playlistTrackData).length
    },
    avgHappiness () {
      const happiness = Object.keys(this.playlistTrackData).reduce((sum, item) => {
        return (sum += this.playlistTrackData[item].valence)
      }, 0) / this.totalTracks
      return happiness.toFixed(3)
    },
    happinessEmoji () {
      const emoji = this.happiness < 0.333
        ? '😔' : this.happiness < 0.666 ? '😐' : '😊'
      return emoji
    },
    avgDanciness () {
      const danciness = Object.keys(this.playlistTrackData).reduce((sum, item) => {
        return (sum += this.playlistTrackData[item].danceability)
      }, 0) / this.totalTracks
      return danciness.toFixed(3)
    },
    avgTempo () {
      const tempo = Object.keys(this.playlistTrackData).reduce((sum, item) => {
        return (sum += this.playlistTrackData[item].tempo)
      }, 0) / this.totalTracks
      return Math.round(tempo)
    },
    avgLength () {
      const length = Object.keys(this.playlistTrackData).reduce((sum, item) => {
        return (sum += this.playlistTrackData[item].duration_ms)
      }, 0) / this.totalTracks

      const minutes = Math.floor(length / 60000)
      const seconds = ((length % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    },
    popularity () {
      const popularity = this.activePlaylist.items.reduce((sum, item) => {
        return (sum += item.track.popularity)
      }, 0) / this.totalTracks
      return popularity < 20
        ? 'super underground, man'
        : popularity < 50 ? 'indie' : 'mainstream'
    }
  }
}
</script>
