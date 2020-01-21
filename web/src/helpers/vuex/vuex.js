const sortNumericalDataByDate = (data) => (
  data.sort((a, b) => (
    new Date(a.data.timestamp) - new Date(b.data.timestamp)
  ))
);

const sortSentimentDataByDate = (data) => (
  data.sort((a, b) => (
    new Date(a.timestamp) - new Date(b.timestamp)
  ))
);

const filterByCurrency = (currency, data) => (
  data.filter((datum) => (
    datum.currency === currency
  ))
);

const getNewNumericalData = (currentData, newData, currency) => (
  sortNumericalDataByDate([
    ...filterByCurrency(currency, currentData[currency]),
    ...filterByCurrency(currency, newData)
  ])
);

const getNewSentimentData = (currentData, newData, currency) => (
  sortSentimentDataByDate([
    ...filterByCurrency(currency, currentData[currency]),
    ...filterByCurrency(currency, newData)
  ])
);

const handleNumericalData = (store, data) => {
  const currentNumericalData = store.getters.getNumericalData;

  const newNumericalData = {
    BTC: getNewNumericalData(currentNumericalData, data, 'BTC'),
    ETH: getNewNumericalData(currentNumericalData, data, 'ETH'),
    LTC: getNewNumericalData(currentNumericalData, data, 'LTC'),
    XRP: getNewNumericalData(currentNumericalData, data, 'XRP')
  }

  store.commit('setNumericalData', newNumericalData);
};

const handleSentimentData = (store, data) => {
  const currentSentimentData = store.getters.getSentimentData;

  const newSentimentData = {
    BTC: getNewSentimentData(currentSentimentData, data, 'BTC'),
    ETH: getNewSentimentData(currentSentimentData, data, 'ETH'),
    LTC: getNewSentimentData(currentSentimentData, data, 'LTC'),
    XRP: getNewSentimentData(currentSentimentData, data, 'XRP')
  }

  store.commit('setSentimentData', newSentimentData);
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

    socket.onmessage = ({ data: message }) => {
      const { action, data } = JSON.parse(message);

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
