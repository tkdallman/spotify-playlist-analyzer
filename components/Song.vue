<template lang='pug'>
  .song(:class="{ 'song--dark': darkTheme }")
    .song__title
      h2 {{ track.name }}
      h3 {{artists }}

    .song__track-info
      template(v-if="isLoading && !trackData")
        Loader
      template(v-if="trackData")
        p(v-for="field in displayedFields")
          strong {{ field + ': ' }}
          span(v-if="field === 'Key'") {{ translatedKey }}
          span(v-else-if="field === 'Valence'") {{ translatedValence }}
          span(v-else-if="field === 'Tempo'") {{ Math.round(trackData[field.toLowerCase()]) + ' bpm'}}
          span(v-else) {{ trackData[field.toLowerCase()] }}
</template>
<script>
import { mapState } from 'Vuex'
import Loader from '~/components/Loader'

export default {
  components: {
    Loader
  },
  props: {
    song: {
      type: Object,
      required: true
    },
    darkTheme: {
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      playlistTrackData: state => state.playlistTrackData,
      isLoading: state => state.isLoading
    }),
    track () {
      return this.song.track
    },
    artists () {
      return this.track.artists.reduce((str, artist) => str + ' ' + artist.name, '')
    },
    trackData () {
      return this.playlistTrackData[this.song.track.id] || undefined
    },
    displayedFields () {
      return ['Key', 'Tempo', 'Energy', 'Danceability', 'Valence']
    },
    translatedKey () {
      const keychangeKey = {
        0: 'C', 1: 'C♯/D♭', 2: 'D', 3: 'D♯/E♭', 4: 'E', 5: 'F', 6: 'F♯/G♭', 7: 'G', 8: 'G♯/A♭', 9: 'A', 10: 'A#/B♭', 11: 'B'
      }
      return keychangeKey[this.trackData.key]
    },
    translatedMode () {
      switch (this.trackData.mode) {
        case '0':
          return 'min'
        case '1':
          return 'maj'
        default:
          return ''
      }
    },
    translatedValence () {
      const valence = this.trackData.valence
      if (valence < 0.333) {
        return `${valence} 😔`
      } else if (valence < 0.666) {
        return `${valence} 😐`
      } else {
        return `${valence} 😊`
      }
    }
  }
}
</script>
