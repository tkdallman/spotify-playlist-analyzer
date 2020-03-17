<template lang='pug'>
  .song(:class="{ 'song--dark': darkTheme }")
    .song__title
      h2 {{ track.name }}
      h3 {{artists }}
    .song__track-info(v-if='trackData')
      p(v-for="field in displayedFields")
        strong {{ field + ': ' }}

        span(v-if="field === 'key'") {{ translatedKey }}
        span(v-else-if="field === 'valence'") {{ translatedValence }}
        span(v-else-if="field === 'tempo'") {{ Math.round(trackData[field]) + ' bpm'}}
        span(v-else) {{ trackData[field] }}
</template>
<script>
import { mapState } from 'Vuex'

export default {
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
      playlistTrackData: state => state.playlistTrackData
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
      return ['key', 'tempo', 'energy', 'danceability', 'valence']
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
<style lang="scss">

.song {
  border-top: 1px solid grey;
  padding: 16px;
  display: flex;

  h3 {
    letter-spacing: 2px;
    font-weight: 400;
  }

  p {
    line-height: 1.4;
    text-align: left;
    padding-left: 16px;
  }

  &__title {
    flex-basis: 50%;
    padding-right: 0 16px;
    flex-direction: column;
    display: flex;
    align-items: flex-start;
    text-align: left;
  }

  &__track-info {
    flex-basis: 50%;
  }

  &--dark {
    background-color: #d4d0d6;
  }
}
</style>
