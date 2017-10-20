<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button @click.native="search">查询</md-button>
        <md-button @click.native="clear">清空</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <!-- <md-button>复制</md-button> -->
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="list()">列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="searchCount('dialog')">统计</md-button>
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
        <md-layout md-gutter="4" v-if="showCont&&hasTJ">
          <md-bip-input v-for="(cell, index) in contCel.cels" :key="cell.id" :cell="cell" :modal="modal" :is-search="true" v-if="cell.isShow" :btj="true" @change="tjChange"></md-bip-input>
        </md-layout>
        <md-layout class="flex" v-if="!groupTJ">
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
                    <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type<12"></md-bip-ref>
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
        <md-loading :loading="loading"></md-loading>
        <md-layout class="flex" v-if="groupTJ">
           <md-bip-chart :groupfilds="groupfilds" :groupdatafilds="groupdatafilds" :modal="modal" :pcell="layoutCel.obj_id" :doSearch="doSearCh" :searchCelId="contCel.obj_id" :ptjCell="tjcell" :ptjPage="tjpage" :chartType="ctype" :showChart="showChart"></md-bip-chart>
        </md-layout>
      </md-content>
      
      <md-dialog ref="dialog" class="md-bip-dialog">
        <md-dialog-title>{{mdTitle}}--统计选择</md-dialog-title>
        <md-dialog-content>
          <md-input-container>
            <label for="groupfilds" >统计项选择</label>
            <md-select id="groupfilds" multiple v-model="groupfilds">
              <md-option v-for="(cell, index) in layoutCel.cels"
                :key="index"
                :value="cell.id" v-if="cell.type !== 3 &&cell.isShow">
                {{cell.labelString}}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="groupdatafilds">数据项选择</label>
            <md-select multiple v-model="groupdatafilds" required>
              <md-option v-for="(cell, index) in layoutCel.cels"
                :key="index"
                :value="cell.id" v-if="cell.type == 3&&cell.isShow">
                {{cell.labelString}}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="ctype">图表类型</label>
            <md-select v-model="ctype">
              <md-option v-for="(item, index) in chartList"
                :key="item.id"
                :value="item.id">
                {{item.name}}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <md-checkbox id="my-test1" name="my-test1" v-model="checkShowC">是否显示图表</md-checkbox>
          </md-input-container>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="closeDialog('dialog')">取消</md-button>
          <md-button class="md-primary" @click="okDialog('dialog')">确定</md-button>
        </md-dialog-actions>
      </md-dialog>
    </md-part-body>
  </md-part>
</template>
<script>
import common from '../commonModal.js'
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
      modal:{},
      hasTJ: false,
      groupfilds: [],
      groupdatafilds: [],
      groupTJ: false,
      doSearCh: 0,
      tjcell:{},
      tjpage:{},
      ctype:'',
      chartList:[{id:'pie',name:'饼图'},{id:'line',name:'线图'},{id:'column',name:'柱状图'}],
      showChart:true,
      checkShowC:1,
      initSC:true,
      loading:0
    } 
  },
  mixins:[common,reportformat],
  methods: {
    fetchUIData () {
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.localStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': this.mparams.pcell,
        'pbuid': this.initSC?this.$route.query.pbuid:'',
        'pdata': JSON.stringify(this.modal),
        'bebill': this.mparams.beBill ? 1 : 2,
        'currentPage': this.pageInfo.page,
        'pageSize': this.pageInfo.size,
        'cellid': ''
      }
      this.loading++
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
      console.log(res)
      this.loading = 0;
      if (res.data.id === 0) {
        this.contCel = res.data.data.contCel;
        this.groupTJ = res.data.data.bcount;
        this.layoutCel = res.data.data.layCels;
        if(this.groupTJ){
          this.groupfilds = res.data.data.groupfilds;
          this.groupdatafilds = res.data.data.groupdatafilds;
          this.tjcell = res.data.data.tjlayCels;
          this.tjpage = res.data.data.pages;
          this.ctype = res.data.data.chartType;
        }else{
          this.pages = res.data.data.pages;
          this.pageInfo.page = this.pages.currentPage;
          this.pageInfo.total = this.pages.totalItem;
          this.pageInfo.size = this.pages.pageSize;
        }
        if(this.contCel)
          this.hasTJ = true;
      }
    },
    search() {
      if(this.groupTJ){
        this.doSearCh++;
        this.showCont = false;
      }else{
        this.pageInfo.page = 1;
        this.fetchUIData();
      }
    },
    clear() {
      this.modal =  {};
    },
    list() {
      this.groupTJ = false;
      this.initSC = false;
      if(this.pageInfo.total==0)
        this.search();
    },
    searchCount (ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs[ref].close();
    },
    okDialog(ref){
      if(this.groupdatafilds.length>0&&this.groupfilds.length>0){
        this.$refs[ref].close();
        this.groupTJ = true;
        if(this.doSearCh === Number.MAX_SAFE_INTEGER){
          this.doSearCh = 0;
        }else{
          this.doSearCh++;
        }
      }
    },
    getCallError (res) {
      this.loading = 0;
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
      this.vdatas = {};
      this.pages = {};
      this.modal = {};
      this.fetchUIData();
    },
    tjChange(data){
      var celId = data.cellId;
      if(data.cols){
        this.$set(this.modal,celId.id,data.value[data.cols[0]]);
      }else{
        this.$set(this.modal,celId.id,data.value);
      }
      console.log(data);
    }
  },
  watch: {
    'mparams': function (){
      this.initUI()
    },
    'modal': function () {
      this.pageInfo.page = 1;
    },
    'checkShowC':function () {
      console.log(this.checkShowC)
      if(this.checkShowC==1){
        this.showChart = true;
      }else{
        this.showChart = false;
      }
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


