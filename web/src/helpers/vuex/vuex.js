const sortByDate = (data) => (
  data.sort((a, b) => (
    new Date(a.data.timestamp) - new Date(b.data.timestamp)
  ))
);

const filterByCurrency = (currency, data) => (
  data.filter((datum) => (
    datum.currency === currency
  ))
);

const getNewNumericalData = (currentData, newData, currency) => (
  sortByDate([
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
  /**
   * @todo Handle sentiment data
   */
};

const createWebSocketPlugin = (socket) => (
  (store) => {
    socket.onopen = () => {
      console.log('[WS]: Connected to WebSocket');

      socket.send(JSON.stringify({
        action: 'getNumericalData'
      }));

      socket.send(JSON.stringify({
        action: 'getSentimentData'
      }));
    }

    socket.onmessage = ({ data: message }) => {
      const { action, data } = JSON.parse(message);

      console.log('ACTION RECEIVED: ', action);

      switch (action) {
        case 'getNumericalData' || 'sendNumericalData':
          handleNumericalData(store, data);
          break;

        case 'getSentimentData' || 'sendSentimentData':
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
