<template>
    <md-layout md-flex="100">
      <md-card>
          <md-card-media> 
              <md-layout md-flex="33" md-flex-xsmall="100">
                <md-chart ref="reportChart"></md-chart>
              </md-layout>
          </md-card-media>
      </md-card>
  </md-layout>
</template>
<script>
import temp1 from './options.js'
import temp2 from './options2.js'
export default {
  data(){
      return {
          id1:'test',
          id2:'test2',
          id3:'test3',
          option:{},
          option1:{},
          option2:{}
      }
  },
  mounted() {
    this.option = temp1.bar;
    this.option2 = temp2.bar;
    // console.log()
    console.log(this.option)
  },
  watch:{
    'option2': function (){
      this.$refs.reportChart.mergeOption(this.option2)
      console.log('optionchange')
    }
  }
}
</script>

<style>
.myChart {
  min-height: 300px;
}
</style>
