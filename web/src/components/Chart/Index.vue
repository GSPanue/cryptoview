<template>
  <el-col>
    <el-col class="header">
      <el-row type="flex">
        <h3>{{ this.name }} (${{ this.ticker }})</h3>
      </el-row>
      <el-row type="flex">
        <h4>Price Movements</h4>
      </el-row>
    </el-col>
    <el-col>
      <base-chart :ticker="this.ticker" />
    </el-col>
  </el-col>
</template>

<script>
export default {
  props: [
    'name',
    'ticker'
  ]
}
</script>

<style scoped>
.header {
  margin-left: 11px;
}
</style>
