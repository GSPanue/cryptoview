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

    socket.onmessage = ({ data: rawMessage }) => {
      const { request, response } = JSON.parse(rawMessage);

      switch (request) {
        case 'getNumericalData':
          handleNumericalData(store, response);
          break;

        case 'getSentimentData':
          handleSentimentData(store, response);
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
