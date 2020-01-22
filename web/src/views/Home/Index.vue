<template>
  <el-row v-if="isReady" class="container" type="flex" flexDirection="row" justify="center" align="middle">
    <el-col>
      <!-- Cryptocurrency Chart -->
      <el-row type="flex" flexDirection="row" justify="center">
        <el-card class="chart-container">
          <chart :name="getSelected.name" :ticker="getSelected.ticker" />
        </el-card>
      </el-row>
      <div class="spacer" />
      <!-- Cryptocurrency Table -->
      <el-row type="flex" flexDirection="row" justify="center">
        <el-card class="table-container">
          <crypto-table :selected="getSelected.ticker" />
        </el-card>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { Loading } from 'element-ui';
import { mapGetters, mapMutations } from 'vuex';

let loadingInstance = Loading.service({
  text: 'Connecting to service...',
  background: 'rgb(255, 255, 255)'
});

export default {
  computed: {
    ...mapGetters([
      'getConnected',
      'getSelected',
      'getNumericalData',
      'getSentimentData'
    ]),
    isReady() {
      const numericalData = this.getNumericalData;
      const sentimentData = this.getSentimentData;

      if (numericalData && sentimentData) {
        return (numericalData.count > 0 && sentimentData.count > 0);
      }

      return false;
    }
  },
  methods: {
    ...mapMutations([
      'setSelected',
      'reset'
    ]),
    setDefaultSelected() {
      const numericalData = this.getNumericalData;
      const currencies = Object.keys(numericalData);
      const { name, ticker } = numericalData[currencies[0]];

      this.setSelected({
        name,
        ticker
      });
    }
  },
  watch: {
    getConnected(nextConnected, prevConnected) {
      if (nextConnected) {
        loadingInstance.close();

        loadingInstance = Loading.service({
          text: 'Gathering data from service...',
          background: 'rgb(255, 255, 255)'
        });
      }
      else {
        loadingInstance.close();

        loadingInstance = Loading.service({
          text: 'Connecting to service...',
          background: 'rgb(255, 255, 255)'
        });
      }
    },
    isReady(nextIsReady, prevIsReady) {
      if (nextIsReady) {
        this.setDefaultSelected();
        loadingInstance.close();
      }
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}

.chart-container {
  max-width: 1000px;
  width: 100%;
  padding: 40px;
}

.table-container {
  max-width: 1000px;
  width: 100%;
  padding: 10px 40px;
}

.spacer {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
