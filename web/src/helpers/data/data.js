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

const createNewNumericalData = (currentData, newData, currency) => (
  sortNumericalDataByDate([
    ...filterByCurrency(currency, currentData[currency]),
    ...filterByCurrency(currency, newData)
  ])
);

const createNewSentimentData = (currentData, newData, currency) => (
  sortSentimentDataByDate([
    ...filterByCurrency(currency, currentData[currency]),
    ...filterByCurrency(currency, newData)
  ])
);

const countData = (data) => {
  let count = 0;

  for (const currency in data) {
    count += data[currency].length
  }

  return count;
};

export {
  sortNumericalDataByDate,
  sortSentimentDataByDate,
  filterByCurrency,
  createNewNumericalData,
  createNewSentimentData,
  countData
};
