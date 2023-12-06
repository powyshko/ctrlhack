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
import BaseCard from './common/BaseCard.vue';
import BaseButton from './common/BaseButton.vue';
import BaseLabel from './common/BaseLabel.vue';
import BaseInput from './common/BaseInput.vue';
import LogList from './log/LogList.vue';
import debounce from '../utils/debounce';
import { LOCALESTORAGE_KEY, MESSAGES, STATUSES } from '../constants/common';
import { StorageService } from '../services/storageService';

const FIELDS_NAME = {
  price: 'price',
  qty: 'qty',
  amount: 'amount'
}

export default {
  name: 'TheDefaultLog',

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
      nonce: 0,
      logEvents: [],
      localStorageData: '',
      firstFieldChangeName: '',
    };
  },

  computed: {
    reverseLogEvents() {
      return [...this.logEvents].reverse();
    }
  },

  methods: {
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

      this.setLogEvent(eventItem);
    },

    getEventItem(message, type = STATUSES.success) {
      return {
        data: this.form,
        type,
        message
      }
    },

    setLogEvent(eventItem) {
      const { data, type, message } = eventItem

      const date = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`

      const event = {
        date,
        data: JSON.stringify(data),
        type,
        message
      }

      this.logEvents.push(event)
    },

    onSubmit() {
      const eventItem = this.getEventItem(MESSAGES.CLICK_ON_SAVE)

      this.setLogEvent(eventItem);

      this.saveToLoacaleStorage();
    },

    saveToLoacaleStorage() {
      const { amount } = this.form;

      setTimeout(() => {
        if (amount % 2 === 0) {
          this.nonce++;

          const data = { ...this.form, nonce: this.nonce }

          this.localStorageData = JSON.stringify(data);

          StorageService.setItem(LOCALESTORAGE_KEY, data);

          const eventItem = {
            data,
            type: STATUSES.success,
            message: MESSAGES.SAVE_RESULTS
          }

          this.setLogEvent(eventItem);
        } else {
          const eventItem = this.getEventItem(MESSAGES.ERROR_MESSAGE, STATUSES.error)

          this.setLogEvent(eventItem);
        }
      }, 1000)
    }
  },

  created() {
    this.localStorageData = StorageService.getItem(LOCALESTORAGE_KEY) || '';

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
