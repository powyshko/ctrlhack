<template>
  <button
    class="base-button"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButton'
}
</script>

<style lang="scss" scoped>
.base-button {
  padding: 8px;
  border-radius: 8px;
  color: white;
  background-color: #4F46E5;
  border: 1px solid #4F46E5;
  cursor: pointer;
}</style>