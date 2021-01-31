<template lang='pug'>
  ul.item-list
    li.item-list__item(v-for="item in items")
      a.item-list__link(role="button" @click="clickFn([item.id, item.name])") {{ item.name }}
</template>
<script>

export default {
  name: 'ItemList',
  props: {
    items: {
      type: Array,
      required: true
    },
    clickFn: {
      type: Function,
      required: true
    }
  }
}
</script>
