import Vue from 'vue';
import Vuex from 'vuex';

import { createWebSocket, createWebSocketPlugin } from '@/helpers';

Vue.use(Vuex);

const socket = createWebSocket();
const webSocketPlugin = createWebSocketPlugin(socket);

const store = new Vuex.Store({
  state: {
    connected: false,
    numericalData: {
      BTC: [],
      ETH: [],
      LTC: [],
      XRP: [],
      count: 0
    },
    sentimentData: {
      BTC: [],
      ETH: [],
      LTC: [],
      XRP: [],
      count: 0
    }
  },
  getters: {
    getConnected: ({ connected }) => (
      connected
    ),
    getNumericalData: ({ numericalData }) => (
      numericalData
    ),
    getSentimentData: ({ sentimentData }) => (
      sentimentData
    )
  },
  mutations: {
    setConnected: (store, newConnected) => {
      store.connected = newConnected;
    },
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
