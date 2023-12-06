<template>
  <base-card class="the-default-log">
    <form class="the-default-log__row">
      <div class="the-default-log__row-item">
        <base-input
          v-model.number="form.price"
          label="Цена"
          placeholder="Введите цену"
          min="0"
          @input="changeField($options.FIELDS_NAME.price)"
        />

        <base-label class="the-default-log__label"> {{ form.price || 0 }} </base-label>
      </div>

      <div class="the-default-log__row-item">
        <base-input
          v-model.number="form.qty"
          label="Кол-во"
          placeholder="Введите кол-во"
          min="0"
          @input="changeField($options.FIELDS_NAME.qty)"
        />

        <base-label class="the-default-log__label"> {{ form.qty || 0 }} </base-label>
      </div>

      <div class="the-default-log__row-item">
        <base-input
          v-model.number="form.amount"
          label="Сумма"
          placeholder="Введите сумму"
          min="0"
          @input="changeField($options.FIELDS_NAME.amount)"
        />

        <base-label class="the-default-log__label"> {{ form.amount || 0 }} </base-label>
      </div>

      <div class="the-default-log__row-item">
        <base-button @click.prevent="onSubmit"> Отправить данные </base-button>

        <base-label class="the-default-log__label"> {{ localStorageData }} </base-label>
      </div>
    </form>

    <div class="the-default-log__logs-container">
      <base-card>
        <log-list :log-items="reverseLogEvents" />
      </base-card>
    </div>
  </base-card>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import BaseCard from './common/BaseCard.vue';
import BaseButton from './common/BaseButton.vue';
import BaseLabel from './common/BaseLabel.vue';
import BaseInput from './common/BaseInput.vue';
import LogList from './log/LogList.vue';
import debounce from '../utils/debounce';
import { MESSAGES, STATUSES } from '../constants/common';

const FIELDS_NAME = {
  price: 'price',
  qty: 'qty',
  amount: 'amount'
}

export default {
  name: 'TheVuexLog',

  components: {
    BaseCard,
    BaseButton,
    BaseInput,
    BaseLabel,
    LogList
  },

  data() {
    return {
      form: {
        price: 0,
        qty: 0,
        amount: 0,
      },
      firstFieldChangeName: '',
    };
  },

  computed: {
    ...mapGetters('logs', ['reverseLogEvents', 'localStorageData']),
  },

  methods: {
    ...mapMutations('logs', ['SET_LOG_EVENT']),
    ...mapActions('logs', ['SAVE_TO_LOCALE_STORAGE', 'INIT_LOCALESTORAGE']),

    changeField(fieldName) {
      if (!this.firstFieldChangeName) {
        this.firstFieldChangeName = fieldName;
      }

      debounce(this.calculationOfFormFields(fieldName), 300)
    },

    calculationOfFormFields(fieldName) {
      if (this.firstFieldChangeName) {
        const { price, qty, amount } = this.form;

        const isPrice = this.firstFieldChangeName === FIELDS_NAME.price;
        const isQty = this.firstFieldChangeName === FIELDS_NAME.qty;
        const isAmount = fieldName === FIELDS_NAME.amount;

        if (isAmount) {
          if (isPrice) {
            this.form.price = amount / qty
          } else if (price && isQty) {
            this.form.qty = amount / price
          } else if (price && qty) {
            this.form.price = amount / qty
            this.form.qty = amount / price
          }

          this.form.amount = amount;
        } else {
          this.form.amount = price * qty;
        }
      }

      const eventItem = this.getEventItem(MESSAGES.UPDATES_FIELDS)

      this.SET_LOG_EVENT(eventItem);
    },

    getEventItem(message, type = STATUSES.success) {
      return {
        data: this.form,
        type,
        message
      }
    },

    onSubmit() {
      const eventItem = this.getEventItem(MESSAGES.CLICK_ON_SAVE)

      this.SET_LOG_EVENT(eventItem);

      this.SAVE_TO_LOCALE_STORAGE(this.form);
    },
  },

  created() {
    this.INIT_LOCALESTORAGE();

    if (this.localStorageData) {
      const { price, qty, amount, nonce } = this.localStorageData

      this.form.price = price
      this.form.qty = qty
      this.form.amount = amount
      this.nonce = nonce
    }
  },

  FIELDS_NAME
};
</script>

<style lang="scss" scoped>
.the-default-log {
  &__row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 20px;
  }

  &__row-item {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__label {
    text-align: center;
    font-weight: bold;
  }
}
</style>
