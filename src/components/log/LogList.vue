<template>
  <ul class="log-list">
    <log-item
      v-for="(logItem, index) in logItems"
      :key="`${logItem.date}-${index}`"
      :item="logItem"
    />
  </ul>
</template>

<script>
import LogItem from './LogItem.vue'

export default {
  name: 'LogList',

  components: { LogItem },

  props: {
    logItems: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>