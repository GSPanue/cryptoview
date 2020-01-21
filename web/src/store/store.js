import Vue from 'vue';
import Vuex from 'vuex';

import { createWebSocket, createWebSocketPlugin } from '@/helpers';

Vue.use(Vuex);

const socket = createWebSocket();
const webSocketPlugin = createWebSocketPlugin(socket);

const store = new Vuex.Store({
  state: {
    connected: false,
    ready: false,
    numericalData: {
      BTC: [],
      ETH: [],
      LTC: [],
      XRP: []
    },
    sentimentData: {
      BTC: [],
      ETH: [],
      LTC: [],
      XRP: []
    }
  },
  getters: {
    getConnected: ({ connected }) => (
      connected
    ),
    getReady: ({ ready }) => (
      ready
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
    setReady: (store, newReady) => {
      store.ready = newReady;
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
