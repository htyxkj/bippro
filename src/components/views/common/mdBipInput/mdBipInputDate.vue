<template>
    <md-input-container>
      <label>{{cell.labelString}}</label>
      <md-date v-model="modal[cell.id]" :required="cell.isReq"></md-date>
    </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
}
</script>
