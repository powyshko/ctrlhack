<template>
  <div class="base-card">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
};
</script>

<style lang="scss" scoped>
.base-card {
  padding: 15px;
  background-color: #F8FAFC;
  border: 1px solid #9CA3AF;
  border-radius: 16px;
}
</style>
