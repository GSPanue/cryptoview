import {
  getCryptocurrencies,
  createNewNumericalData,
  createNewSentimentData,
  countData,
  hasData,
  combineDataObject
} from '@/helpers';

const handleNumericalData = (store, data) => {
  const cryptocurrencies = getCryptocurrencies(data);
  const currentNumericalData = store.getters.getNumericalData;

  let newNumericalData = {};

  cryptocurrencies.map((currency) => {
    const { name, ticker } = currency;

    newNumericalData[ticker] = {
      ...createNewNumericalData(currentNumericalData, data, ticker),
      name,
      ticker
    };
  });

  const nextNumericalData = {
    ...hasData(currentNumericalData) && currentNumericalData,
    ...newNumericalData
  };

  store.commit('setNumericalData', {
    ...nextNumericalData,
    count: countData(nextNumericalData)
  });
};

const handleSentimentData = (store, data) => {
  const cryptocurrencies = getCryptocurrencies(data);
  const currentSentimentData = store.getters.getSentimentData;

  let newSentimentData = {};

  cryptocurrencies.map((currency) => {
    const { name, ticker } = currency;

    newSentimentData[ticker] = {
      ...createNewSentimentData(currentSentimentData, data, ticker),
      name,
      ticker
    };
  });

  const nextSentimentData = {
    ...hasData(currentSentimentData) && currentSentimentData,
    ...newSentimentData
  };

  store.commit('setSentimentData', {
    ...nextSentimentData,
    count: countData(nextSentimentData)
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
