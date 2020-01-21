import {
  createNewNumericalData,
  createNewSentimentData,
  countData
} from '@/helpers';

const handleNumericalData = (store, data) => {
  const currentNumericalData = store.getters.getNumericalData;

  const newNumericalData = {
    BTC: createNewNumericalData(currentNumericalData, data, 'BTC'),
    ETH: createNewNumericalData(currentNumericalData, data, 'ETH'),
    LTC: createNewNumericalData(currentNumericalData, data, 'LTC'),
    XRP: createNewNumericalData(currentNumericalData, data, 'XRP')
  }

  store.commit('setNumericalData', {
    ...newNumericalData,
    count: countData(newNumericalData)
  });
};

const handleSentimentData = (store, data) => {
  const currentSentimentData = store.getters.getSentimentData;

  const newSentimentData = {
    BTC: createNewSentimentData(currentSentimentData, data, 'BTC'),
    ETH: createNewSentimentData(currentSentimentData, data, 'ETH'),
    LTC: createNewSentimentData(currentSentimentData, data, 'LTC'),
    XRP: createNewSentimentData(currentSentimentData, data, 'XRP')
  }

  store.commit('setSentimentData', {
    ...newSentimentData,
    count: countData(newSentimentData)
  });
};

const createWebSocketPlugin = (socket) => (
  (store) => {
    socket.onopen = () => {
      console.log('[WS]: Connected to WebSocket');
      store.commit('setConnected', true);

      socket.send(JSON.stringify({
        action: 'getNumericalData'
      }));

      socket.send(JSON.stringify({
        action: 'getSentimentData'
      }));
    }

    socket.onclose = () => {
      console.log('[WS]: Disconnected from WebSocket');
      store.commit('reset');
    }

    socket.onmessage = ({ data: message }) => {
      const { action, data } = JSON.parse(message);

      console.log(`[WS]: Received action: ${action}`);

      switch (action) {
        case 'getNumericalData':
          handleNumericalData(store, data);
          break;

        case 'getSentimentData':
          handleSentimentData(store, data);
          break;

        case 'sendNumericalData':
          handleNumericalData(store, data);
          break;

        case 'sendSentimentData':
          handleSentimentData(store, data);
          break;

        default:
          break;
      }
    }
  }
);

export {
  createWebSocketPlugin
};
