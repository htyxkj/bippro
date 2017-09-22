<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button >保存</md-button>
        <md-button >放弃</md-button>
        <md-button >新增</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>复制</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button >列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-pager></md-part-toolbar-pager>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>分配方法</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>编辑</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content class="flex layout-column">
        <md-layout md-gutter>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20"  md-theme="'md-warn'">
            <md-input-container :class="'md-accent'">
              <label>编码</label>
              <md-input required></md-input>
            </md-input-container>
          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20">
            <md-input-container>
              <label>名称</label>
              <md-input required></md-input>
            </md-input-container>
          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20">
            <md-input-container>
              <label>核算目的</label>
              <md-input-ref>
              </md-input-ref>
            </md-input-container>
          </md-layout>
        </md-layout>
        <md-layout class="flex">
          <md-table-card class="flex">
            <md-table class="flex">
              <md-table-header>
                <md-table-row>
                  <md-table-head>阿米巴</md-table-head>
                  <md-table-head>分配基数</md-table-head>
                </md-table-row>
              </md-table-header>
              <md-table-body>
              </md-table-body>
            </md-table>
            <md-table-tool>
              <md-table-action md-insert
                ></md-table-action>
              <md-layout class="flex"></md-layout>
              <md-table-pagination
                  md-size="5"
                  md-total="10"
                  md-page="1"
                  md-label="每页"
                  md-separator="/"
                  :md-page-options="[5, 10, 25, 50]">
              </md-table-pagination>
            </md-table-tool>
          </md-table-card>
        </md-layout>
      </md-content>
    </md-part-body>
    <md-ref></md-ref>
  </md-part>
</template>
<style scoped>
.md-card {
  margin: 0.15rem;
}

@media (max-width: 600px) {
  .md-card {
    margin: 0;
  }
}
</style>
<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

