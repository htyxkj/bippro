<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button>查询</md-button>
        <md-button>新增</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>复制</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
         <md-button @click="showSearchInfo">{{showContLabel}}</md-button>
      </md-part-toolbar-group>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{mdTitle}}</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>列表</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content class="flex layout-column">
        <md-layout md-gutter="4" v-if="showCont">
          <md-bip-input v-for="(cell, index) in contCel.cels" :key="cell.id" :cell="cell"></md-bip-input>
        </md-layout>
        <md-layout class="flex">
          <md-table-card>
            <md-table class="flex">
              <md-table-header>
                <md-table-row>
                  <md-table-head v-for="(item, index) in layoutCel.cels" :key="index" v-if="item.isShow" :md-numeric="item.type<12">{{item.labelString}}</md-table-head>
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
                    <md-bip-ref :inputValue="row[column.id]|formartObj(column,row[column.id])" :bipRefId="column" :md-numeric="column.type<12"></md-bip-ref>
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
        </md-layout>
      </md-content>
    </md-part-body>
  </md-part>
</template>
<script>
import reportformat from './reportformat.js';
export default {
  data () {
    return {
      vdatas: {},
      contCel: {},
      layoutCel: {},
      pages: {},
      mdAutoSelect: false,
      mdSelection: false,
      pageInfo: {
        size:20,
        total:0,
        page:1
      },
      model:{
        date:null
      }
    } 
  },
  mixins:[reportformat],
  methods: {
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
        this.contCel = res.data.data.contCel;
        this.layoutCel = res.data.data.layCels;
        this.pages = res.data.data.pages;
        this.pageInfo.page = this.pages.currentPage;
        this.pageInfo.total = this.pages.totalItem;
        this.pageInfo.size = this.pages.pageSize;
      }
    },
    getCallError (res) {

    },
    dblclick (row) {

    },
    setRowColor(_index){
      _index = _index % 2;
      if ( _index !== 0){
        return true;
      }
      return false;
    },
    numRed (vals,cell) {
      if(cell.type === 3 &&vals<0)
        return true;
      return false;
    },
    initUI () {
      this.current = 1;
      this.pageSize = 20;
      this.vdatas = {};
      this.pages = {};
      this.fetchUIData();
    }
  },
  props: ['mdTitle','mparams'],
  watch: {
    'mparams': function (){
      console.log('watch')
      this.initUI()
    }
  },
  mounted () {
    if(this.mparams){
      this.initUI()
    }
  }
}
</script>
<style lang="scss" scoped>
.md-num-red{
  color: red;
}

.md-table-head.md-numeric {
    // text-align: right;
    color:rgba(81,162,81,.91);
}
</style>


