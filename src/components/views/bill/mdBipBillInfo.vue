<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button>新建</md-button>
        <md-button class="md-accent">删除</md-button>
        <md-button>保存</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="list">列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>复制</md-button>
        <md-button >审核</md-button>
        <md-button >提交</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
      </md-part-toolbar-group>
      <md-part-toolbar-pager @paging="paging" :options="pager"></md-part-toolbar-pager>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{mdTitle}}</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>新增</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content class="flex layout-column">
        <md-content class="layout-column">
        <md-layout md-gutter="2" class="flex">
          <md-bip-input v-for="(cell, index) in layoutCel.cels" :key="cell.id" :cell="cell" :modal="modal" class="bip-input"></md-bip-input>
        </md-layout>
        </md-content>
         <md-layout class="flex layout-column" v-if="subCellsCount>0">
          <md-table-card class="flex">
            <md-table @select="onTableSelect" class="flex">
              <md-table-header>
                <md-table-row>
                  <md-table-head v-for="(item,itemIndex) in subLayCells.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
                </md-table-row>
              </md-table-header>
              <md-table-body>
              </md-table-body>
            </md-table>
             <md-table-tool>
              <md-table-action 
                md-insert
                ></md-table-action>
              <md-layout class="flex"></md-layout>
              <md-table-pagination
                  md-size="5"
                  md-total="10"
                  md-page="1"
                  md-label="Rows"
                  md-separator="of"
                  :md-page-options="[5, 10, 25, 50]"
                  @pagination="onTablePagination">
              </md-table-pagination>
            </md-table-tool>
          </md-table-card>
         </md-layout>
      </md-content>
      <!-- <md-content class="flex layout-column">
        fdsfds
      </md-content> -->
    </md-part-body>
  </md-part>
</template>
<script>
import modal from './modal.js'
export default {
  mixins:[modal]
}
</script>

<style lang="scss" scoped>
.md-bip-bill{
  // min-height: 0;
  // max-height: 40%;
  // height: 3rem;
  overflow-y: auto;
}
.md-input-container{
  max-height: 0.48rem;
  margin: 0 0;
}
.md-layout{
  margin-bottom: 2px !important;
  margin-top: 2px !important;
}

</style>

