<template>
  <md-toolbar>
    <md-button class="md-icon-button" @click.native="toggle()">
      <md-icon>menu</md-icon>
    </md-button>
    <h2 class="md-title">{{mdTitle}}</h2>
    <div class="md-flex">
      <md-input-container class="md-flex md-header-search">
        <md-input class="md-header-search-input" placeholder="搜索"></md-input>
      </md-input-container>
    </div>
    <md-button class="md-icon-button">
      <md-icon>notifications</md-icon>
    </md-button>
    <md-menu md-direction="bottom left" ref="menuUser">
      <md-button class="md-icon-button md-avatar" md-menu-trigger>
        <md-avatar>
          <img src="../../img/avatar/1.jpg">
        </md-avatar>
      </md-button>
      <md-menu-content>
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{user.userName}}</div>
              <div class="md-subhead">{{user.userCode}}</div>
            </md-card-header-text>
            <md-card-media>
              <img src="../../img/avatar/1.jpg" alt="People">
            </md-card-media>
          </md-card-header>
          <md-menu md-direction="bottom left" ref="menuEnts">
            <md-button md-menu-trigger>{{deptInfo.cmcName}}
              <md-icon>arrow_drop_down</md-icon>
            </md-button>
            <md-menu-content>
              <!-- <md-menu-item v-for="item in $root.userData.ents" :key="item">{{item.name }}</md-menu-item> -->
            </md-menu-content>
          </md-menu>
          <md-card-actions>
            <div class="layout-row layout-fill layout-align-space-between-center">
              <md-button>添加账号</md-button>
              <md-button @click="logOut">退出</md-button>
            </div>
          </md-card-actions>
        </md-card>
      </md-menu-content>
    </md-menu>
  </md-toolbar>
</template>
<script>
export default {
  data () {
    return {
      user: {},
      deptInfo: {}
    }
  },
  props: {
    mdToken: String,
    mdTitle: String
  },
  methods: {
    toggle() {
      this.$emit('toggle');
    },
    logOut() {
      this.$emit('logout')
    }
  },
  mounted(){
    this.user = JSON.parse(window.localStorage.getItem('user'))
    this.deptInfo = this.user.deptInfo
  }
};
</script>

<style lang="scss" scoped>

.md-input-container.md-flex.md-header-search{
  margin:0 0 0 60% ;
  .md-header-search-input{
    border-radius: 0.04rem;
      width: 80%;
  }

}
.md-input-container{
  min-height: .3rem;
}

.md-title{
  font-family:  "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
  font-size: 0.18rem;
}

@media (max-width: 600px) {
  .md-title{
    font-family:  "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
    font-size: 0.14rem;
  }
}


.md-input-container.md-has-value input {
  font-size: 0.14rem;
}

.md-avatar {
    width: 0.3rem;
    min-width: 0.3rem;
    height: 0.3rem;
    min-height: 0.3rem;
    border-radius: 0.3rem;
}
</style>
