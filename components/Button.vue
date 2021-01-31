<template lang='pug'>
  button(@click="clickFn()") {{ text }}
</template>
<script>

export default {
  props: {
    text: {
      type: String,
      required: true
    },
    clickFn: {
      type: [Promise, Function],
      required: true
    }
  }
}
</script>
