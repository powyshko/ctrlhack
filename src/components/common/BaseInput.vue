<template>
  <div class="base-input">
    <label>
      <div class="base-input__label"> {{ label }} </div>

      <input
        :value="value"
        :placeholder="placeholder"
        :type="type"
        v-bind="$attrs"
        class="base-input__input"
        @input="$emit('input', $event.target.value)"
      >
    </label>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',

  props: {
    value: {
      type: [String, Number],
      default: 0
    },

    type: {
      type: String,
      default: 'number'
    },

    placeholder: {
      type: String,
      default: ''
    },

    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.base-input {
  &__label {
    margin-bottom: 2px;
  }

  &__input {
    padding: 8px;
    border: 1px solid #9CA3AF;
    border-radius: 8px;
  }
}
</style>