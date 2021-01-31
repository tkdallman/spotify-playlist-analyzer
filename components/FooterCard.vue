<template lang='pug'>
  Card
    .card__footer
      h4.card__small-header Notes :
      ul
        li.card__list-item This is mostly for fun, this data doesn't actually appear to be super accurate i.e. bpm values often have 3 decimal places
        li.card__list-item  {{ 'Ratings like happiness are based on valence, which is a Spotify algorithm. More information can be found ' }}
          a(href='https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/') here
        li.card__list-item  This was built by tkdallman@gmail.com using VueJS and Nuxt
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'FooterCard',
  components: { Card }
}
</script>
