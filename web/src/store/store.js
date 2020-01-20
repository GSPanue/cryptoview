import Vue from 'vue';
import Vuex from 'vuex';

import { createWebSocket, createWebSocketPlugin } from '@/helpers';

Vue.use(Vuex);

const socket = createWebSocket();
const webSocketPlugin = createWebSocketPlugin(socket);

const store = new Vuex.Store({
  state: {
    numericalData: {
      BTC: [],
      ETH: [],
      LTC: [],
      XRP: []
    },
    sentimentData: []
  },
  getters: {
    getNumericalData: ({ numericalData }) => (
      numericalData
    ),
    getSentimentData: ({ sentimentData }) => (
      sentimentData
    )
  },
  mutations: {
    setNumericalData: (store, newNumericalData) => {
      store.numericalData = newNumericalData;
    },
    setSentimentData: (store, newSentimentData) => {
      store.sentimentData = newSentimentData;
    }
  },
  plugins: [webSocketPlugin]
});

export default store;
