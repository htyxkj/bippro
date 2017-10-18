<template>
  <md-layout md-gutter md-column>
    <md-layout md-gutter md-row>
      <md-layout md-flex-small="100" md-flex="66">
        <md-card>
          <md-card-media>
            <md-chart class="myChart" ref="xsChart" :options="columnChart" :autoResize="true"></md-chart>
          </md-card-media>
          <md-card-media>
            <md-layout>
              <md-layout md-flex="33" md-flex-xsmall="100">
                <!-- <md-chart ref="groupStructure"></md-chart> -->
                <md-chart ref="pieChart" :options="pieChart" :autoResize="true"></md-chart>
              </md-layout>
              <md-layout md-flex="66" md-flex-xsmall="100">
                <!-- <md-chart ref="groupRank"></md-chart> -->
                <md-chart ref="groupRank" :options="lineChart" :autoResize="true"></md-chart>
              </md-layout>
            </md-layout>
          </md-card-media>
        </md-card>
      </md-layout>
      <md-layout md-flex-small="100" md-flex="33">
        <md-card>
          <md-tabs md-fixed :md-dynamic-height="false" style="min-height:4rem" class="md-primary layout-fill">
            <md-tab md-label="公告通知">
              <md-list class="custom-list md-triple-line">
                <md-list-item v-for="item in model.news" :key="item.sid">
                  <div class="md-list-text-container">
                    <span>{{ item.title }}</span>
                    <p>{{ item.content }}</p>
                    <span>{{ item.mkdate }}</span>
                  </div>
                  <md-button class="md-icon-button md-list-action">
                    <md-icon class="md-primary">star</md-icon>
                  </md-button>
                  <md-divider></md-divider>
                </md-list-item>
              </md-list>
            </md-tab>
            <md-tab md-label="待办事宜" :md-options="{new_badge: 3}">
              <md-table class="flex">
                <md-table-header>
                  <md-table-row>
                    <md-table-head v-for="(item, index) in taskLayCel.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
                  </md-table-row>
                </md-table-header>
                <md-table-body>
                  <md-table-row :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in taskValues" :key="rowIndex" :md-item="row" @dblclick.native="dblclick(row)">
                    <md-table-cell v-for="(column, columnIndex) in taskLayCel.cels" :key="columnIndex" v-if="column.isShow" :md-numeric="column.type<12">
                      <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row"></md-bip-ref>
                    </md-table-cell>
                  </md-table-row>
                </md-table-body>
              </md-table>
            </md-tab>
            <md-tab md-label="最新邮件">
              <md-list class="custom-list md-triple-line">
                <md-list-item v-for="item in model.knowledges" :key="item.id">
                  <div class="md-list-text-container">
                    <span>{{ item.title }}</span>
                    <p>{{ item.summary }}</p>
                  </div>
                  <md-button class="md-icon-button md-list-action">
                    <md-icon class="md-primary">star</md-icon>
                  </md-button>
                  <md-divider></md-divider>
                </md-list-item>
              </md-list>
            </md-tab>
          </md-tabs>
        </md-card>
      </md-layout>
    </md-layout>
  </md-layout>
</template>
<script>
import _ from 'lodash';
import pieC from './pieC.js';
import columnC from './columnC.js';
import lineC from './lineC.js'
import commUtil from '@/components/core/utils/common.js'

export default {
  data() {
    return {
      model: {
        news: [
          { sid: '1', title: '测试', content: '' },
        ],
        prices: [
          { id: '1', title: '测试', price: 100 },
          { id: '2', title: 'xxxx1', price: 100 },
          { id: '3', title: 'xxxx2', price: 100 },
          { id: '4', title: 'xxxx3', price: 100 },
          { id: '5', title: 'xxxx4', price: 100 },
          { id: '6', title: 'xxxx5', price: 100 },
          { id: '7', title: 'xxxx6', price: 100 },
        ]
      },
      pieChart: pieC.bar,
      columnChart: columnC.chart,
      lineChart: lineC.chart,
      taskLayCel: {},
      taskValues: [],
      xsValues: []

    }
  },
  mounted() {
    //SYGG
    this.doQuery();
  },
  methods: {
    doQuery() {
      var option = {
        'pageSize': 20,
        'page': 1,
        'assistid': '{SYGG}',
      };
      this.getAssistODataByAPI(option, this.getCallBack, this.getCallError);
      this.fetchTaskData();
      this.fetchXSData();
    },
    getCallBack(res) {
      // console.log(res);
      if (res.data.code == 1)
        this.model.news = res.data.values;
    },
    getCallError(res) {

    },
    fetchTaskData() {
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.localStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': 'SYRW',
        'pdata': '{brd:0,}',
        'bebill': 1,
        'currentPage': 1,
        'pageSize': 20,
        'cellid': ''
      }
      this.getDataByAPINew(data1, this.getTaskCallBack, this.getCallError)
    },
    fetchXSData() {
      let year = commUtil.now('YYYY');
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.localStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': 'SYBMSX',
        'pdata': '{yy:' + year + '}',
        'bebill': 1,
        'currentPage': 1,
        'pageSize': 9999,
        'cellid': ''
      }
      this.getDataByAPINew(data1, this.getXSCallBack, this.getCallError)
    },
    getTaskCallBack(res) {
      if (res.data.id == 0) {
        this.taskLayCel = res.data.data.layCels;
        this.taskValues = res.data.data.pages.celData;
      }
    },
    getXSCallBack(res) {
      if (res.data.id == 0) {
        this.xsValues = res.data.data.pages.celData;
        var sers = [];
        _.forEach(this.xsValues, (item, key) => {
          var bb = _.findIndex(sers,(value)=>{
            return value.name == item.orgname;
          })
          if (bb>-1) {
            sers[bb].data[item.mm - 1] = item.fcy;
            // sers[bb+1].data[item.mm - 1] = item.qty;
          } else {
            var cc = { name: item.orgname, data: [0,0,0,0,0,0,0,0,0,0,0,0] };
            cc.data[item.mm - 1] = item.fcy;
            sers.push(cc);
            // var dd = { name: item.orgname+"-数量", data: [0,0,0,0,0,0,0,0,0,0,0,0] };
            // cc.data[item.mm - 1] = item.qty;
            // sers.push(dd);
          }
        });
        this.columnChart.series = sers;
        this.$refs.xsChart.mergeOption(this.columnChart);
      }
    },
    dblclick(row) {

    },
    setRowColor(_index) {
      _index = _index % 2;
      if (_index !== 0) {
        return true;
      }
      return false;
    },
  }
}
</script>

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
