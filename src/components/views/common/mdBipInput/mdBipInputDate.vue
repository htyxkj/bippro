<template>
    <md-input-container>
      <label>{{cell.labelString}}</label>
      <md-date v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled" :btime="cell.type==93"></md-date>
    </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
}
</script>
