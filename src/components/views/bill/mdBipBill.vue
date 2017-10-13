<template>
  <md-part>
    <md-bip-bill-info v-if="!blist" :mdTitle="mdTitle" :mparams="mparams" @list="list"></md-bip-bill-info>
    <md-bip-bill-list v-else :mdTitle="mdTitle" :mparams="mparams" @create="create"></md-bip-bill-list>
  </md-part>
</template>
<script>
import modalCC from './modal.js'
export default {
  data () {
    return {
      blist: true
    }
  },
  mixins:[modalCC],
  methods:{
    create () {
      this.blist = false;
    },
    list () {
      this.blist = true;
    }
  }
}
</script>

