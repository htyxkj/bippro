<template>
<div class="layout-fill">
    <div  v-if="isLogin" class="md-app layout-fill layout-column flex">
      <bip-menus ref="menu" :md-token="mdToken" :md-title="mdTitle"></bip-menus>
      <app-toolbar ref="toolbar" @toggle="toggle" :md-token="mdToken" :md-title="mdTitle" @logout="logout"></app-toolbar>
      <app-content class="layout-fill flex md-part layout-column"></app-content>      
  </div>
  <div v-else>
    <app-login  @emitLogin="emitLogin"></app-login>
  </div>
  
</div>
</template>
<script>
import appToolbar from './myAppToolbar';
import appContent from './myAppContent';
import bipMenu from './bipMenus';
import Login from '../Login';
export default {
  name: 'myapp',
  data () {
    return {
      mdToken: 'bbb',
      mdTitle: '',
      isLogin: false
    }
  },
  components:{'app-toolbar':appToolbar,'app-content':appContent,'bip-menus': bipMenu,'app-login':Login},
  methods: {
    toggle() {
      this.$refs.menu.toggle();
      this.setTitle();
    },
    setTitle() {
        if(this.$route.query.title){
        this.mdTitle = this.$route.query.title
      }else{
        if(this.$route.path == '/' || this.$route.path == '/index'){
          this.mdTitle = '首页';
        }else{
          this.mdTitle = this.$route.path;
        }
      }
    },
    emitLogin(){
      this.isLogin = true;
      window.sessionStorage.setItem('isLogin', JSON.stringify(this.isLogin))
    },
    logout() {
      this.isLogin = false;
      window.sessionStorage.setItem('isLogin', JSON.stringify(this.isLogin))
      this.$router.push({path:'/',name:''})
      // console.log(this.$route)
    }
  },
  mounted(){
    this.isLogin = window.sessionStorage.getItem('isLogin');
    this.setTitle();
  },
  watch: {
    '$route': 'toggle'
  }
};
</script>

<style lang="scss">

.bipcontent{
  overflow: scroll;
}

</style>


