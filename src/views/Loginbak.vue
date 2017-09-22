<template>
  <div class="layout-row layout-align-center-center layout-fill">
    <div class="panel login-box">
      <div class="panel-heading">
        <h2 class="panel-title">BIP管理应用平台</h2>
      </div>
      <div class="panel-body">
        <div >
          <div class="form-group">
            <input class="form-control" type="text" v-model="usercode" value="" placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <input class="form-control" type="password" name="pwd" placeholder="请输入登陆密码">
          </div>
          <div class="form-group layout layout-align-space-between-center">
            <a href="">找回我的账号密码</a>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block" @click="loginRemote">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
// import router from '../router'
export default {
  data() {
    return {
      usercode: '',
      pwd: ''
    }
  },
  mounted() {
  },
  methods: {
    loginRemote() {
      console.log('login')
      var data1 = {
        apiId: global.APIID_LOGIN,
        dbid: global.DBID,
        usercode: this.usercode,
        pwd: this.base64Encode(this.pwd)
      }
      var _self = this
      axios.post(global.BIPAPIURL, qs.stringify(data1)).then(function(res) {
        console.log(res)
        if (res.data.id === 0) {
          var userI = res.data.data.user
          var mlist = res.data.data.menulist
          window.localStorage.setItem('user', JSON.stringify(userI))
          window.localStorage.setItem('menulist', JSON.stringify(mlist))
          // global.isLogin = true
          // _self.$router.push({
          //   path: 'index'
          // })
          // _self.$notify.open({ content: '登录成功', placement: 'bottom-right', type: 'info' })
          _self.$emit('emitLogin');
        } else {
          // _self.$notify.open({ content: res.data.message, placement: 'top-center', type: 'danger' })
        }
      }).catch(function(err) {
        console.log(err)
        console.log('错误了')
        // _self.$notify.open({ content: '网络连接错误', placement: 'top-center', type: 'danger' })
      })
    }
  }
}
</script>

<style lang="css" scoped>
/* @import '../sass/auth.css'; */

</style>


