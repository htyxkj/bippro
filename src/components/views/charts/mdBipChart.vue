<template>
  <md-layout md-flex="100">
    <md-card>
      <md-card-media>
        <!-- <md-layout md-flex="33" md-flex-xsmall="100" class="md-bip-chart">
          <md-chart ref="bipRChart"></md-chart>
        </md-layout> -->
        <md-layout md-flex="33" md-flex-xsmall="100" class="md-bip-chart">
          <md-chart ref="reportChart"></md-chart>
        </md-layout>
      </md-card-media>
      <md-layout class="flex">
        <md-table-card>
          <md-table class="flex">
            <md-table-header>
              <md-table-row>
                <md-table-head v-for="(item, index) in tjcell.cels" :key="index" v-if="item.isShow">{{item.labelString}}</md-table-head>
              </md-table-row>
            </md-table-header>
            <md-table-body>
              <md-table-row :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in tjpages.celData" :key="rowIndex" :md-item="row" v-if="startIndex<=rowIndex && endIndex>=rowIndex">
                <md-table-cell v-for="(column, columnIndex) in tjcell.cels" :key="columnIndex" v-if="column.isShow" :class="numRed(row[column.id],column) ? 'md-num-red':''">
                  <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" @makeRef="makeRef"></md-bip-ref>
                </md-table-cell>
              </md-table-row>
            </md-table-body>
          </md-table>
          <md-table-tool>
            <md-layout class="flex"></md-layout>
            <md-table-pagination :md-size="pageInfo.size" :md-total="pageInfo.total" :md-page="pageInfo.page" md-label="每页" md-separator="/" :md-page-options="[10,20, 30, 50]" @pagination="onTablePagination">
            </md-table-pagination>
          </md-table-tool>
        </md-table-card>
      </md-layout>
    </md-card>
  </md-layout>
</template>
<script>
import pieOpt from './pieOptions.js'
import clmOpt from './columnOptions.js'
import common from '../commonModal.js'
export default {
  data() {
    return {
      option: {},
      pieOption: {},
      pageInfo: {
        size: 999,
        total: 0,
        page: 1
      },
      tjcell: {},
      tjpages: {},
      startIndex: 1,
      endIndex: 0,
      refValues: []
    }
  },
  mixins: [common],
  props: { groupfilds: Array, groupdatafilds: Array, pcell: String, searchCelId: String, modal: Object, doSearch: Number },
  mounted() {
    this.option = clmOpt.bar;
    this.pieOption = pieOpt.bar;
    this.searchData()
  },
  watch: {
    'option': function() {
      this.$refs.reportChart.mergeOption(this.option)
      // this.$refs.bipRChart.mergeOption(this.pieOption)
      // console.log('optionchange')
    },
    'doSearch': function() {
      if (this.doSearch)
        this.searchData();
    },
    'pcell': function() {
      this.searchData();
    }
  },
  methods: {
    searchData() {
      this.pageInfo.page = 1;
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.localStorage.getItem('user')).userCode,
        'apiId': global.APIID_FINDDATA,
        'pcell': this.pcell,
        'psearch': this.searchCelId,
        'pdata': JSON.stringify(this.modal),
        'currentPage': this.pageInfo.page,
        'pageSize': this.pageInfo.size,
        'groupfilds': JSON.stringify(this.groupfilds),
        'groupdatafilds': JSON.stringify(this.groupdatafilds)
      }
      if (this.groupfilds.length > 0 && this.groupdatafilds.length > 0 && this.pcell && this.doSearch > 0) {
        this.getDataByAPINew(data1, this.getCallBack, this.getCallError)
      }
    },
    getCallBack(res) {
      if (res.data.id === 0) {
        this.refValues = _.take(this.refValues, 0);
        this.tjcell = res.data.data.tjlayCels;
        this.tjpages = res.data.data.tjpages;
        this.pageInfo.total = this.tjpages.totalItem;
        this.pageInfo.size = this.tjpages.pageSize;
        this.caclStartAndEndIndex();
      }
    },
    getCallError(res) {

    },
    makePieOpitons() {
      var data = [];
      this._.each(this.tjpages.celData, (item, key) => {
        var name = this.getGroupFldName(item);
        data.push({ name: name, y: item[this.groupdatafilds[0]] })
      });
      this.pieOption.series[0].data = data;
      this.$refs.bipRChart.mergeOption(this.pieOption);
    },
    makeColumnOpitons() {
      var categories = [];
      var series = [];
      this._.each(this.tjpages.celData, (item, key) => {
        var name = this.getGroupFldName(item);
        categories.push(name);
        this._.each(this.groupdatafilds, (fld, key1) => {
          var _idx = _.findIndex(series, function(im) {
            return im.name == fld;
          });
          if (_idx >= 0) {
            var bb = series[_idx];
            bb.data[key] = item[fld];
            series[_idx] = bb;
          } else {
            var bb = { name: '', data: [] };
            bb.name = fld;
            bb.data[key] = item[fld];
            series.push(bb);
          }
        });
      });
      // console.log(categories);
      // console.log(series);
      this.option.xAxis.categories = categories;
      this.option.series.splice();
      this.option.series = series;
      this.$refs.reportChart.mergeOption(this.option)

    },
    getGroupFldName(items) {
      var name = "";
      this._.each(this.groupfilds, (fld, indx) => {
        var id = fld;
        var code = items[id];
        var getNum = _.findIndex(this.refValues, function(item) {
          return (item.id == id) && (item.code == code);
        });
        if (getNum >= 0) {
          name += this.refValues[getNum].name + "-"
        } else {
          name += code + "-"
        }
      });
      name = name.substr(0, name.length - 1);
      return name;
    },
    onTablePagination(pager) {
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.caclStartAndEndIndex();
    },
    caclStartAndEndIndex() {
      this.startIndex = (this.pageInfo.page - 1) * this.pageInfo.size;
      this.endIndex = this.startIndex + this.pageInfo.size - 1;
    },
    makeRef(refId, refData) {
      var data = { 'id': refId, 'code': refData.code, 'name': refData.name }
      var exi = _.findIndex(this.refValues, data);
      if (exi === -1) {
        this.refValues.push(data);
      } else {
        data = this.refValues[exi];
        data.name = refData.name;
        this.refValues[exi] = data;
      }
      var id = refId;
      var code = refData.code;
      var _self = this;
      var getNum = _.findIndex(this.refValues, function(item) {
        return (item.id == id) && (item.code == code);
      });
      // this.makePieOpitons();
      this.makeColumnOpitons();
    }
  }
}
</script>

<style>
.myChart {
  min-height: 300px;
  height: 300px;
}

.md-bip-chart {
  height: 300px;
}
</style>
