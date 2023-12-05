<template>
  <li
    class="log-item"
    :class="classes"
  >
    <span>{{ item.date }}</span> •
    <span>{{ item.message }}</span> •
    <span>{{ item.data }}</span>
  </li>
</template>

<script>
import { STATUSES } from '../../constants/common'
export default {
  name: 'LogItem',

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    classes() {
      const baseClass = 'log-item';

      return {
        [`${baseClass}--${STATUSES.success}`]: this.item.type === STATUSES.success,
        [`${baseClass}--${STATUSES.error}`]: this.item.type === STATUSES.error,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.log-item {
  font-size: 16px;
  font-weight: 600;

  &--success {
    color: #22C55E;
  }

  &--error {
    color: #EF4444;
  }
}
</style>