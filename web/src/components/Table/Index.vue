<template>
  <el-table
    ref="table"
    class="table"
    :data="createTableData"
    highlight-current-row
    @current-change="handleCurrentChange"
    :row-class-name="createClassName"
  >
    <el-table-column class="test" property="name" label="Name" />
    <el-table-column property="ticker" label="Ticker" />
    <el-table-column property="latestPrice" label="Latest Price" />
    <el-table-column property="sentiment" label="Sentiment" />
  </el-table>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  updated() {
    const selected = this.getSelected.ticker;
    const tableData = this.createTableData;

    const row = this.getRow(tableData, selected);

    this.$refs.table.setCurrentRow(row);
  },
  computed: {
    ...mapGetters([
      'getSelected',
      'getNumericalData',
      'getSentimentData'
    ]),
    createTableData() {
      const { count, ...numericalData } = this.getNumericalData;
      const sentimentData = this.getSentimentData;

      const tickers = Object.keys(numericalData);

      const tableData = tickers.map((ticker) => {
        const latestPrice = this.getLatestPrice(numericalData, ticker);
        const latestSentiment = this.getLatestSentiment(sentimentData, ticker);

        return {
          name: numericalData[ticker].name,
          ticker,
          latestPrice: this.formatLatestPrice(latestPrice),
          sentiment: this.formatLatestSentiment(latestSentiment)
        }
      });

      return tableData;
    }
  },
  methods: {
    ...mapMutations([
      'setSelected'
    ]),
    getLatestPrice(data, ticker) {
      const lastNumericalDataIndex = Object.keys(data[ticker].data).length - 1;

      return data[ticker].data[lastNumericalDataIndex].data.price;
    },
    getLatestSentiment(data, ticker) {
      const lastSentimentDataIndex = Object.keys(data[ticker].data).length - 1;

      return data[ticker].data[lastSentimentDataIndex].sentiment;
    },
    formatLatestPrice(price) {
      return '$' + (price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    formatLatestSentiment(sentiment) {
      return sentiment.toLowerCase().replace(/^./, (str) => (
        str.toUpperCase()
      ));
    },
    getRow(data, selectedTicker) {
      return data.filter(({ ticker }) => (
        ticker === selectedTicker
      ))[0];
    },
    handleCurrentChange(nextRow, prevRow) {
      const row = (nextRow) ? nextRow : prevRow;
      const { name, ticker } = row;

      this.setSelected({
        name,
        ticker
      });
    },
    createClassName({ row: { ticker } }) {
      const { ticker: selectedTicker } = this.getSelected;

      return (ticker === selectedTicker) ? 'selected' : '';
    }
  },
  watch: {
    getSelected(nextSelected, prevSelected) {
      const selected = this.getSelected.ticker;
      const tableData = this.createTableData;

      const row = this.getRow(tableData, selected);

      this.$refs.table.setCurrentRow(row);
    }
  }
}
</script>

<style scoped>
.table >>> .el-table__row {
  cursor: pointer;
  user-select: none;
}

.el-table >>> .selected {
  font-weight: bold;
}
</style>
