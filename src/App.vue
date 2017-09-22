<template>
<div>
<my-app></my-app>
</div>
  
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      islogin : false
    }
  },
  mounted () {
    console.log('app')
  }
}
</script>
