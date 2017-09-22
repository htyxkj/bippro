<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button>新建</md-button>
        <md-button class="md-accent">删除</md-button>
        <md-button>保存</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>列表</md-button>
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
        <md-part-toolbar-crumb>列表</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content class="flex layout-column">
        <md-layout md-gutter="2" class="flex md-bip-bill">
          <md-bip-input v-for="(cell, index) in layoutCel.cels" :key="cell.id" :cell="cell" :modal="modal"></md-bip-input>
        </md-layout>
         <md-layout class="flex">
          <md-table-card class="flex">
            <md-table @select="onTableSelect" class="flex">
              <md-table-header>
                <md-table-row>
                  <md-table-head v-for="(item,itemIndex) in subLayCells.cels" :key="item.id">{{item.labelString}}</md-table-head>
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
    </md-part-body>
  </md-part>
</template>
<script>
export default {
  data () {
    return {
      pager: {
        firstId:'1',
        lastId:'5',
        prevId:'',
        nextId:'2',
      },
      pageInfo: {
        size:20,
        total:0,
        page:1
      },
      pages: {},
      layoutCel: {},
      subLayCells: {},
      modal: {}
    }
  },
  methods: {
    paging (id) {
    },
    fetchUIData () {
      var contCelStr = ''
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.localStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': this.mparams.pcell,
        'pdata': contCelStr,
        'bebill': this.mparams.beBill ? 1 : 2,
        'currentPage': this.pageInfo.page,
        'pageSize': this.pageInfo.size,
        'cellid': ''
      }
      if (this.mparams.pcell) {
        this.getDataByAPINew(data1,this.getCallBack,this.getCallError)
      }
    },
    onTablePagination (pager) {
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.fetchUIData();
    },
    getCallBack(res){
      if (res.data.id === 0) {
        this.layoutCel = res.data.data.layCels;
        this.subLayCells = this.layoutCel.subLayCells[0];
        this.pages = res.data.data.pages;
        this.pageInfo.page = this.pages.currentPage;
        this.pageInfo.total = this.pages.totalItem;
        this.pageInfo.size = this.pages.pageSize;
        this.initModal()
      }
    },
    getCallError (res) {

    },
    dblclick (row) {

    },
    initModal () {
      for(let i = 0; i <  this.layoutCel.cels.length;i++) {
        var item = this.layoutCel.cels[i];
        this.modal[item.id] = item.initValue;
      }
    },
    initUI () {
      this.current = 1;
      this.pageSize = 20;
      this.vdatas = {};
      this.page = {};
      this.fetchUIData();
    },
    onTableSelect(){}
  },
  props: ['mdTitle','mparams'],
  mounted () {
    if(this.mparams){
      this.initUI()
      console.log('bill-mounted')
    }
  }
}
</script>

<style lang="scss" scoped>
.md-bip-bill{
  max-height: 50%;
  overflow-y: auto;
}
</style>

