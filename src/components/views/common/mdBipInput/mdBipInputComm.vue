<template>
    <md-input-container>
      <label>{{cell.labelString}}</label>
      <md-input v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled"  @blur="onBlur"></md-input>
    </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  watch:{
    'modal': function(){
      console.log('modal change')
    }
  },
  methods:{
    onBlur(){
      var data = {};
      data.cellId = this.cell;
      data.value = this.modal[this.cell.id];
      data.multiple = false;
      this.$emit('change',data);
    }
  }

}
</script>