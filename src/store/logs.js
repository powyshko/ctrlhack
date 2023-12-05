import { StorageService } from '../services/storageService';
import { LOCALESTORAGE_KEY, MESSAGES, STATUSES } from '../constants/common';

const state = {
  nonce: 0,
  logEvents: [],
  localStorageData: ''
};

const getters = {
  reverseLogEvents: state => [...state.logEvents].reverse(),
  localStorageData: state => state.localStorageData
};

const mutations = {
  SET_LOG_EVENT(state, eventItem) {
    const { data, type, message } = eventItem;

    const date = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;

    const event = {
      date,
      data: JSON.stringify(data),
      type,
      message
    };

    state.logEvents.push(event);
  },

  INC_NONCE(state) {
    state.nonce++;
  },

  SET_LOCALESTORAGE_DATA(state, data) {
    state.localStorageData = data;
  }
};

const actions = {
  SAVE_TO_LOCALE_STORAGE({commit, state}, data) {
    setTimeout(() => {
      if (data.amount % 2 === 0) {
        commit('INC_NONCE')

        const dataItem = { ...data, nonce: state.nonce };

        commit('SET_LOCALESTORAGE_DATA', JSON.stringify(dataItem));

        StorageService.setItem(LOCALESTORAGE_KEY, dataItem);

        const eventItem = {
          data,
          type: STATUSES.success,
          message: MESSAGES.SAVE_RESULTS
        };

        commit('SET_LOG_EVENT', eventItem)
      } else {
        const eventItem = {
          data,
          type: STATUSES.error,
          message: MESSAGES.ERROR_MESSAGE
        };

        commit('SET_LOG_EVENT', eventItem)
      }
    }, 1000);
  },

  INIT_LOCALESTORAGE({commit}) {
    const localStorageItem = StorageService.getItem(LOCALESTORAGE_KEY) || '';

    commit('SET_LOCALESTORAGE_DATA', localStorageItem)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
