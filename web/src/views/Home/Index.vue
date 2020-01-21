<template>
  <el-row
    v-if="isReady"
    class="container"
    type="flex"
    flexDirection="row"
    justify="center"
    align="middle"
  >
    <el-card class="chart-container">
      <chart
        currency="Bitcoin"
        ticker="BTC"
      />
    </el-card>
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
      'getNumericalData',
      'getSentimentData'
    ]),
    isReady() {
      const numericalData = this.getNumericalData;
      const sentimentData = this.getSentimentData;

      return (numericalData.count > 0 && sentimentData.count > 0);
    }
  },
  methods: {
    ...mapMutations([
      'reset'
    ]),
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
</style>
