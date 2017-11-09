<template>
  <md-part>
    <md-bip-bill-info v-if="!blist" :mdTitle="mdTitle" :mparams="mparams" @list="list" :history="bhistroy" :myModal="modal"></md-bip-bill-info>
    <md-bip-bill-list v-else :mdTitle="mdTitle" :mparams="mparams" @create="create" @dblclick="dblclick"></md-bip-bill-list>
  </md-part>
</template>
<script>
import modalCC from './modal.js'
export default {
  data () {
    return {
      blist: true,
      bhistroy:false
    }
  },
  mounted () {
    if(this.mparams){
      // this.initUI()
      this.blist = true;
    }
  },
  updated (){
    
  },
  mixins:[modalCC],
  methods:{
    create () {
      this.blist = false;
      this.bhistroy = false;
      this.modal = {};
    },
    list () {
      this.blist = true;
    },
    dblclick(row){
      this.modal = row;
      this.blist = false;
      this.bhistroy = true;
    }
  }
}
</script>

