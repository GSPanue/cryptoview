<template>
  <vue-apex-charts
    class="chart"
    type="area"
    :height="createHeight"
    :options="createOptions"
    :series="createSeries"
  />
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import { mapGetters } from 'vuex';

export default {
  props: [
    'height',
    'ticker'
  ],
  components: {
    VueApexCharts
  },
  computed: {
    ...mapGetters([
      'getNumericalData'
    ]),
    createHeight() {
      const { height } = this;

      return (height) ? height: 350;
    },
    createSeries() {
      const { ticker } = this;
      const numericalData = this.getNumericalData;
      const currencyData = numericalData[ticker].data;

      return [{
        name: 'Price (USD)',
        data: this.getPrices(currencyData)
      }];
    },
    createOptions() {
      const { ticker } = this;
      const numericalData = this.getNumericalData;
      const currencyData = numericalData[ticker].data;

      return {
        chart: {
          zoom: {
            enabled: true
          },
          toolbar: {
            show: true,
            tools: {
              download: false,
              selection: false,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: false,
              reset: true
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy'
          }
        },
        labels: this.getTimestamps(currencyData),
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeFormatter: {
              year: 'MMM yyyy',
              month: 'MMM yyyy'
            }
          }
        },
        yaxis: {
          opposite: true,
          decimalsInFloat: 2,
          labels: {
            formatter: (value) => (
              '$' + (value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            )
          },
          title: {
            text: 'Price (USD)'
          }
        },
        legend: {
          horizontalAlign: 'left'
        }
      }
    }
  },
  methods: {
    getTimestamps(items) {
      return items.map((item) => (
        item.data.timestamp
      ));
    },
    getPrices(items) {
      return items.map((item) => (
        item.data.price
      ));
    }
  }
}
</script>

<style scoped>
.chart {
  max-width: 1000px;
  width: 100%;
  padding-left: 11px;
}

div >>> .apexcharts-toolbar {
  margin-top: -5px;
  right: 37px;
}
</style>
