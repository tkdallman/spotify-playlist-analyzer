<template lang='pug'>
  Card
    .card__header
      .card__sort
        h4 Sort:
        select#SortBy(@change="changeSort")
          option Select a method...
          option Key
          option Tempo
          option Energy
          option Danceability
    ul(v-for="(song, index) in activePlaylist.items")
      Song(:song="song" :darkTheme="index % 2 !== 0")
</template>

<script>
import { mapState, mapActions } from 'Vuex'
import Card from '~/components/Card'
import Song from '~/components/Song.vue'

export default {
  name: 'FooterCard',
  components: {
    Card,
    Song
  },
  computed: {
    ...mapState({
      activePlaylist: state => state.activePlaylist
    })
  },
  methods: {
    ...mapActions([
      'sortPlaylist'
    ]),
    changeSort (e) {
      this.sortPlaylist(e.target.value)
    }
  }
}
</script>
