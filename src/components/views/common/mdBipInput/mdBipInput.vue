<template>
  <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20">
    <md-input-container>
      <label>{{cell.labelString}}</label>
      <md-input v-model="modal[cell.id]" :required="cell.isReq"></md-input>
    </md-input-container>
  </md-layout>
</template>
<script>
export default {
  data () {
    return {
      // values: ''
    }
  },
  props: {cell:Object,isSearch: {Boolean,default:false},modal:{}},
  mounted () {
  },
  methods: {
  },
  watch: {
  }
}
</script>
<<style lang="scss" scoped>

</style>

