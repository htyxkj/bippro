<template>
<div class="md-bip-ref">{{inputValue}}</div>
</template>
<script>
export default {
  props: {'inputValue':null,'bipRefId':Object,mdNumeric: Boolean},
  mounted () {
    if (this.bipRefId && this.bipRefId.refValue) {
      // console.log(this.bipRefId.refValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.md-bip-ref{
  width: 100%;
  height: 100%;
}
</style>

