<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button @click.native="create">新建</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="delList">删除</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
      </md-part-toolbar-group>
      <md-part-toolbar-pager @paging="paging" :options="pager"></md-part-toolbar-pager>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{mdTitle}}</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>列表</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content class="flex layout-column">
         <md-layout class="flex">
          <md-table-card class="flex">
            <md-table @select="onTableSelect" class="flex">
              <md-table-header>
                <md-table-row>
                  <md-table-head v-for="(item, index) in layoutCel.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
                </md-table-row>
              </md-table-header>
              <md-table-body>
                <md-table-row :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in pages.celData" 
                  :key="rowIndex"
                  :md-item="row" 
                  :md-auto-select="mdAutoSelect" 
                  :md-selection="mdSelection" 
                  @dblclick.native="dblclick(row)">
                  <md-table-cell v-for="(column, columnIndex) in layoutCel.cels" :key="columnIndex" v-if="column.isShow" :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''">
                    <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row"></md-bip-ref>
                  </md-table-cell>
                </md-table-row>
              </md-table-body>
            </md-table>
             <md-table-tool>
              <md-layout class="flex"></md-layout>
              <md-table-pagination
                  :md-size="pageInfo.size"
                  :md-total="pageInfo.total"
                  :md-page="pageInfo.page"
                  md-label="每页"
                  md-separator="/"
                  :md-page-options="[10,20, 30, 50]"
                  @pagination="onTablePagination"
                  >
              </md-table-pagination>
            </md-table-tool>
          </md-table-card>
          <md-loading :loading="loading"></md-loading>
         </md-layout>
      </md-content>
    </md-part-body>
  </md-part>
</template>
<script>
import modal from './modal.js'
import billList from './billList.js' 
export default {
  data () {
    return {
      mdAutoSelect: true,
      mdSelection: true,
    }
  },
  mixins:[modal,billList],
  methods:{
    delList(){
      console.log(this.selectData);
      var _self = this;
      _.forEach(this.selectData,function(n,key){
        n.sys_stated = 4;
        var str = JSON.stringify(n);
        //  console.log(str);
        var options = {'pcell': _self.mparams.pcell, 'jsonstr': str};
        _self.saveData(options,_self.delSuccess,_self.delError);
      });
      this.$notify.success({content: '删除成功！'});
    },
    delSuccess(res){
      if(res.data.id == 0){
        // this.$notify.info({content: '删除成功！'});
        this.fetchUIData();
      }
    },
    delError(res){
      this.$notify.danger({content: '出错了！'});
    }
  }
}
</script>

