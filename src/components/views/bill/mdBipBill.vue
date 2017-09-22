<template>
  <md-part>
    <md-bip-bill-info v-if="!blist" :mdTitle="mdTitle" :mparams="mparams" @list="list"></md-bip-bill-info>
    <md-bip-bill-list v-else :mdTitle="mdTitle" :mparams="mparams" @create="create"></md-bip-bill-list>
  </md-part>
</template>
<script>
import modal from './modal.js'
export default {
  data () {
    return {
      blist: true
    }
  },
  mixins:[modal],
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

