<template>
  <el-col>
    <el-col class="header">
      <el-row type="flex">
        <h3><strong>{{ this.name }}</strong> (${{ this.ticker }})</h3>
      </el-row>
      <el-row type="flex">
        <h4>Price Movements</h4>
      </el-row>
    </el-col>
    <el-col>
      <base-chart :ticker="this.ticker" :height="height" />
    </el-col>
  </el-col>
</template>

<script>
export default {
  props: [
    'name',
    'ticker'
  ],
  data() {
    return {
      height: null
    }
  },
  mounted() {
    const windowHeight = window.innerHeight;

    this.height = (windowHeight < 900) ? 200 : null;
  }
}
</script>

<style scoped>
.header {
  margin-left: 11px;
}
</style>
