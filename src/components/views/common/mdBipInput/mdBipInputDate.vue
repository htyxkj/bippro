<template>
    <md-input-container>
      <label>{{cell.labelString}}</label>
      <md-date v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled" :btime="cell.type==93" @change="dataCC"></md-date>
    </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  methods:{
    dataCC(value){
      // console.log(value+'');
      var refBackData = {
          cellId:this.cell,
          value:value,
          multiple:false
      };
      this.$emit('change',refBackData);
    }
  }
}
</script>
