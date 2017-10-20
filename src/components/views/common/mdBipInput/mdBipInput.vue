<template>
  <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20" v-if="cell.isShow">
    <md-bip-input-comm :cell="cell" :modal="modal" v-if="inputType == INPUT_COMMON" :ref="cell.id"></md-bip-input-comm>
    <md-bip-input-date :cell="cell" :modal="modal" v-if="inputType == INPUT_DATE" :ref="cell.id" @change="dataChange"></md-bip-input-date>
    <md-bip-input-ref  :cell="cell" :modal="modal" v-if="inputType == INPUT_REF" @change="dataChange" :ref="cell.id"></md-bip-input-ref>
    <md-bip-input-file :cell="cell" :modal="modal" v-if="inputType == INPUT_FILE" :ref="cell.id"></md-bip-input-file>
    <md-bip-input-list :cell="cell" :modal="modal" v-if="inputType == INPUT_LIST" :ref="cell.id" @change="dataChange"></md-bip-input-list>
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
    this.initType();
  },
  watch:{
    'cell': function(){
      this.initType();
    },
    'modal':function(){
      console.log('modal input');
      // this.onBlur();
    }
  },
  methods: {
    dataChange (data) {
      this.$emit('change',data)
    },
    initType(){
      this.inputType = 0;
      if (this.cell) {
        if (this.cell.assist){
          if (this.cell.type ===91 || this.cell.type ===93 ) {
            if(this.btj){
              this.inputType = 0;
            }else{
              this.inputType = this.INPUT_DATE;
            }
            return ;
          } else if (this.cell.chkRule == '{UPDOWN}') {
            this.inputType = this.INPUT_FILE;
            return ;
          }else {
            if(this.cell.editType==1){
              this.inputType = this.INPUT_LIST;
            }else{
              this.inputType = this.INPUT_REF;
            }
            return ;
          }
        } else {
          this.inputType = 0;
          var refv = this.cell.refValue;
          if(refv == '{&DATETIME}'){
            this.inputType = 0;
            return ;
          }
          if (refv !== undefined &&refv !=='') {
            var _index = refv.indexOf('&');
            if (_index>0){
              this.inputType = this.INPUT_REF;
              return ;
            }
            this.inputType = this.INPUT_LIST;
              return ;
          }
        }
      }
    }

  }
}
</script>

