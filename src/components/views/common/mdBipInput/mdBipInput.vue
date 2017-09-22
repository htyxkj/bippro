<template>
  <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20">
    <md-input-container>
      <label>{{cell.labelString}}</label>
      <md-input v-model="values"></md-input>
    </md-input-container>
  </md-layout>
</template>
<script>
export default {
  data () {
    return {
      values: ''
    }
  },
  props: {cell:Object,isSearch: {Boolean,default:false}},
  mounted () {
    if(this.cell){
      this.initCellValue(this.cell.initValue);
    }
  },
  methods: {
    initCellValue (vals) {
      if (this.cell.type===91 && vals==='0'){
        this.values =  '2017-09';
      } else {
        this.values = vals;
      }
      this.cell.value = this.values;
    }
  },
  watch: {
    'values': function() {
      this.cell.value = this.values;
    }
  }
}
</script>
