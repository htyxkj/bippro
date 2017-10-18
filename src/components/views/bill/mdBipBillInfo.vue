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
          <md-grid ref="grid" :row-focused="false" :auto-load="true" @onAdd="onLineAdd" :showAdd="true" :showRemove="true">
            <md-grid-column v-for="(item,itemIndex) in subLayCells.cels" :key="item.id" v-if="item.isShow" :label="item.labelString" :field="item.id" editable/>
          </md-grid>
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
export default {
  mixins: [modalcm, billInfo],
  methods: {
    dataChange(data) {
      if (!data.multiple) {
        if (data.cellId.assist && data.cellId.type == 12) {
          // this.modal[data.cellId.id] = data.value[data.cols[0]];
          this.$set(this.modal, data.cellId.id, data.value[data.cols[0]]);
          console.log(this.modal,data.cellId.id);
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
        }
      }
      console.log(this.modal,data);
      console.log(this.c_state);
      if ((this.c_state & this.billState.INSERT) > 0) {
        this.incCalc(this.layoutCel);
      }
      this.c_state = this.c_state | this.billState.EDITED;
      // if ((this.c_state & this.billState.POSTED) > 0) {
      //   this.c_state = this.billState.EDITED;
      // }
    },
    create() {
      this.c_state = this.billState.INSERT | this.billState.DICT;
      this.initModal();
    },
    onLineAdd(){
      this.$refs['lineRef'].open();
    }
  },
  watch: {
    'modal': function() {
      // console.log('modal change');
    }
  },
  computed: {
    canCreate() {
      if ((this.c_state & this.billState.INSERT) > 0 || (this.c_state & this.billState.EDITED) > 0) {
        return true;
      } else {
        return false;
      }
    },
    canSave() {
      if ((this.c_state & this.billState.INSERT) > 0 || (this.c_state & this.billState.EDITED) > 0) {
        return false;
      }
      if (((this.c_state & this.billState.POSTED) > 0)) {
        return true;
      }
      return true;
    },
    canDelete() {
      if ((this.c_state & this.billState.INSERT) > 0) {
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

