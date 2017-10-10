<template>
  <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20" v-if="cell.isShow">
    <!-- <md-input-container>
      <label>{{cell.labelString}}</label>
      <md-input v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled"></md-input>
    </md-input-container> -->
    <md-bip-input-comm :cell="cell" :modal="modal" v-if="inputType == INPUT_COMMON"></md-bip-input-comm>
    <md-bip-input-date :cell="cell" :modal="modal" v-if="inputType == INPUT_DATE"></md-bip-input-date>
    <md-bip-input-ref :cell="cell" :modal="modal" v-if="inputType == INPUT_REF"></md-bip-input-ref>
  </md-layout>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  data () {
    return {
      inputType: 0
    }
  },
  created () {
    if (this.cell) {
      console.log('====')
      console.log(this.cell.id)
      console.log(this.cell.type)
      console.log(this.cell.chkRule)
      console.log(this.cell.assist)
      console.log(this.cell.editType)
      console.log('ov')
      if (this.cell.assist){
        if (this.cell.type ===91 || this.cell.type ===93 ) {
          this.inputType = this.INPUT_DATE;
          return ;
        } else if (this.cell.chkRule == '{UPDOWN}') {
          this.inputType = this.INPUT_FILE;
          return ;
        }else {
           this.inputType = this.INPUT_REF;
          return ;
        }
      } else {
        this.inputType = 0;
      }
    }
  }
}
</script>

