const getCryptocurrencies = (data) => {
  const seen = new Set();
  const allCryptocurrencies = data.map((datum) => ({
    name: datum.name,
    ticker: datum.ticker
  }));

  const uniqueCryptocurrencies = allCryptocurrencies.filter((cryptocurrency) => {
    const duplicate = seen.has(cryptocurrency.name)
    seen.add(cryptocurrency.name);

    return !duplicate;
  });

  return uniqueCryptocurrencies.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    return (nameA === nameB) ? 0 : ((nameA < nameB) ? -1 : 1)
  });
}

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

const filterByTicker = (ticker, data) => (
  data.filter((datum) => (
    datum.ticker === ticker
  ))
);

const hasData = (data) => (
  data !== null
);

const createNewNumericalData = (currentData, newData, ticker) => {
  let data;

  if (hasData(currentData)) {
    data = sortNumericalDataByDate([
      ...filterByTicker(ticker, currentData[ticker].data),
      ...filterByTicker(ticker, newData)
    ]);
  }
  else {
    data = filterByTicker(ticker, newData);
  }

  return {
    data
  };
}

const createNewSentimentData = (currentData, newData, ticker) => {
  let data;

  if (hasData(currentData)) {
    data = sortSentimentDataByDate([
      ...filterByTicker(ticker, currentData[ticker].data),
      ...filterByTicker(ticker, newData)
    ]);
  }
  else {
    data = filterByTicker(ticker, newData);
  }

  return {
    data
  };
};

const countData = (data) => {
  let count = 0;

  for (const currency in data) {
    count += data[currency].data.length
  }

  return count;
};

export {
  getCryptocurrencies,
  sortNumericalDataByDate,
  sortSentimentDataByDate,
  filterByTicker,
  hasData,
  createNewNumericalData,
  createNewSentimentData,
  countData
};
