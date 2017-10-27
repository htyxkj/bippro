<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button :disabled="canCreate" @click.native="create">新建</md-button>
        <md-button class="md-accent" :disabled="canDelete" @click.native="delData">删除</md-button>
        <md-button @click.native="save" :disabled="canSave">保存</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="list">列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>复制</md-button>
        <md-button>审核</md-button>
        <md-button>提交</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-pager @paging="paging" :options="pager"></md-part-toolbar-pager>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{mdTitle}}</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>新增</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content v-if="!layoutCel.haveChild" class="layout-fill">
        <md-layout>
          <md-bip-input v-for="(cell, index) in layoutCel.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="modal" class="bip-input" @change="dataChange"></md-bip-input>
        </md-layout>
      </md-content>
      <md-content class="flex layout-column" v-if="layoutCel.haveChild">
        <md-content class="layout-column">
          <md-layout md-gutter="2" class="flex">
            <md-bip-input v-for="(cell, index) in layoutCel.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="modal" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
        </md-content>
        <md-layout class="flex layout-column" v-if="subCellsCount>0">
          <md-bip-grid :datas="subDatas" ref="grid" :row-focused="false" :auto-load="true" @onAdd="onLineAdd" @onRemove="onRemove" :showAdd="true" :showRemove="true" @rowChange="rowChange">
            <md-bip-grid-column v-for="(item,itemIndex) in subLayCells.cels" :key="item.id" :label="item.labelString" :field="item.id" editable :hidden="!item.isShow" :refId="item.chkRule||item.refValue" :script="item.script" :attr="item.attr" :ccPoint="item.ccPoint" :dataType="getDataType(item)" :formatter="formatter">
            </md-bip-grid-column>
          </md-bip-grid>
          <!-- <md-table-card class="flex">
            <md-table class="flex">
              <md-table-header>
                <md-table-row>
                  <md-table-head v-for="(item,itemIndex) in subLayCells.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
                </md-table-row>
              </md-table-header>
              <md-table-body>
              </md-table-body>
            </md-table>
            <md-table-tool>
              <md-table-action md-insert></md-table-action>
              <md-layout class="flex"></md-layout>
              <md-table-pagination md-size="5" md-total="10" md-page="1" md-label="Rows" md-separator="of" :md-page-options="[5, 10, 25, 50]">
              </md-table-pagination>
            </md-table-tool>
          </md-table-card> -->
        </md-layout>
      </md-content>
    </md-part-body>
  </md-part>
</template>
<script>
import modalcm from './modal.js';
import billInfo from './billInfo.js';
import common from '../../core/utils/common.js';
export default {
  mixins: [modalcm, billInfo],
  methods: {
    dataChange(data) {
      console.log('data change');
      if (!data.multiple) {
        console.log(data,this.modal.sys_stated);
        if (data.cellId.assist && data.cellId.type == 12) {
          // this.modal[data.cellId.id] = data.value[data.cols[0]];
          var vvl = "";
          if(data.cols){
            vvl = data.value[data.cols[0]];
          }else{
            vvl = data.value;
          }
          if(this.modal[data.cellId.id] !== vvl){
            this.$set(this.modal, data.cellId.id,vvl);
            this.modal.sys_stated = this.modal.sys_stated | this.billState.EDITED;
          }
          var cellScript = data.cellId.script;
          if (cellScript) {
            var cc = cellScript.split('&');
            var flds = cc[0].split(',');
            var _index = cc[1].split(',');
            for (let i = 0; i < flds.length; i++) {
              var index = parseInt(_index[i]);
              var fld = flds[i];
              this.$set(this.modal, fld, data.value[data.cols[index]]);
              var bb = this.$refs[fld];
              var cc = bb[0].$refs[fld];
              cc.parentChange();
            }
          }
        }else{
          this.$set(this.modal,'sys_stated',(this.modal.sys_stated | this.billState.EDITED));
          // this.modal.sys_stated = this.modal.sys_stated | this.billState.EDITED;
        }
      }
      if ((this.modal.sys_stated & this.billState.INSERT) > 0) {
        this.incCalc(this.layoutCel);
      }
    },
    create() {
      this.initModal(true);
    },
    onLineAdd(){
      var subCell = this.layoutCel.subLayCells[0];
      console.log(subCell);
      var childModal ={}
      childModal = this.createDataModal(subCell,childModal);
      console.log(childModal);
      var bb = subCell.autoInc;
      var _cid = this.subDatas.length;
      if(_cid==0){
        _cid=1;
      }else{
        _cid++;
      }
      childModal[subCell.cels[bb].id] = _cid;
      childModal.sys_created = true;
      this.$set(childModal,'sys_stated',(this.billState.INSERT | this.billState.EDITED));
      if(this.subDatas){
        this.subDatas.push(childModal);
      }
    },
    onRemove(rows){
      _.forEach(rows.data,(rowItem)=>{
        _.remove(this.subDatas,(item,n)=>{
          if (item.vueRowId === rowItem.vueRowId){
            item.sys_stated = 4;
            if((this.modal.sys_stated &this.billState.INSERT)==0)
              this.delDatas.push(item);
            return true;
          }
          return false;
        });
      });
      // console.log(rows);
      // console.log(this.$refs.grid);
      if(rows.data){
        this.modal.sys_stated = this.modal.sys_stated | this.billState.EDITED;
      }
      this.$refs.grid.onReload();
    },
    getWidth(cel){
      // console.log(cel.id,cel.ccLeng,cel);
      // if(cel.ccLeng>0){
      //   return cel.ccLeng+20;
      // }
      return 150;
    },
    getChildData (modal) {
      console.log('getChildData');
      var pkcel = this.layoutCel.cels[this.layoutCel.pkid];
      var pkkey = pkcel.id;
      var count = {};
      count[pkkey] = modal[pkkey];
      count = JSON.stringify(count);
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.localStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': this.mparams.pcell,
        'pdata': count,
        'bebill': this.mparams.beBill ? 1 : 2,
        'currentPage': 1,
        'pageSize': 20,
        'cellid': this.layoutCel.subLayCells[0].obj_id
      }
      console.log(data1);
      this.getDataByAPINew(data1,this.getCallChildBack,this.getCallError);
    },
    getCallChildBack(res){
      console.log(res,'321321');
      if(res.data.id==0){
        this.subDatas = res.data.data.pages.celData;
      }
    },
    rowChange(rowData,column){
      console.log('grid Row Change',rowData,column);
      console.log(this.modal.sys_stated,rowData.sys_stated);
      this.modal.sys_stated = this.modal.sys_stated | this.billState.EDITED;
    },
    formatter(value,data,column){
      if(column.dataType === 'numeric'){
        let pit = column.ccPoint;
        value = common.formatDecimal(value,{precision: pit});
        // data[column.field] = value;
        return value;
      }
      return value;
    }
  },
  watch: {
    'modal': function() {
    }
  },
  computed: {
    canCreate() {
      if((this.modal.sys_stated&this.billState.DICT)>0) return false;
      if ((this.modal.sys_stated & this.billState.INSERT) > 0 || (this.modal.sys_stated & this.billState.EDITED) > 0) {
        return true;
      }else {
        return false;
      }
    },
    canSave() {
      if ((this.modal.sys_stated & this.billState.INSERT) > 0 || (this.modal.sys_stated & this.billState.EDITED) > 0) {
        return false;
      }
      if (((this.modal.sys_stated & this.billState.POSTED) > 0)) {
        return true;
      }
      return true;
    },
    canDelete() {
      if ((this.modal.sys_stated & this.billState.INSERT) > 0) {
        return true;
      }
      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
.md-bip-bill {
  // min-height: 0;
  // max-height: 40%;
  // height: 3rem;
  overflow-y: auto;
}

.md-input-container {
  max-height: 0.48rem;
  margin: 0 0;
}

.md-layout {
  margin-bottom: 2px !important;
  margin-top: 2px !important;
}
</style>

