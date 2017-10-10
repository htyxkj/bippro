<template>
  <md-input-container>
    <div class="md-input-ref layout layout-row">
      <label>{{cell.labelString}}</label>
        <md-input v-model="msg" ></md-input>
        
        <md-button class="md-icon-button md-ref-filter" @click="openRef()">
          <md-icon>search</md-icon>
        </md-button>
        <md-bip-dia ref="ref" :mdRefId="cell.chkRule" :multiple="false" @close="onRefClose" :title="cell.labelString"></md-bip-dia>
    </div>
  </md-input-container>
</template>

<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  data(){
    return{
      msg:''
    }
  },
  methods:{
    openRef(){
      this.$refs['ref'].open()
    },
    onRefClose(data){
      if(data){
        this.msg = data[0].goodsName
        this.$emit('change',data[0])
      }
    },
  },
  
}
</script>
