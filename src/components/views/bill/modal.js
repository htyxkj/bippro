import common from '../../core/utils/common.js';
const defPageInfo = {
  size:20,
  total:0,
  page:1
}
export default {
  data () {
    return {
      pager: {
        firstId:'1',
        lastId:'1',
        prevId:'0',
        nextId:'1',
      },
      pageInfo: {
        size:20,
        total:0,
        page:1
      },
      pages: {},
      layoutCel: {},
      subLayCells: [],
      modal: {},
      mdAutoSelect: false,
      mdSelection: false,
      selectData:[],
      subCellsCount: 0
    }
  },
  methods: {
    list() {
      this.$emit('list');
    },
    paging (id) {
    },
    initUI () {
      this.pageInfo = defPageInfo;
      this.vdatas = {};
      this.page = {};
      this.fetchUIData();
    },
    fetchUIData () {
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.localStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': this.mparams.pcell,
        'pdata': '',
        'bebill': this.mparams.beBill ? 1 : 2,
        'currentPage': this.pageInfo.page,
        'pageSize': this.pageInfo.size,
        'cellid': ''
      }
      if (this.mparams.pcell) {
        this.getDataByAPINew(data1,this.getCallBack,this.getCallError)
      }
    },

    getCallError (res) {
    },
    numRed (vals,cell) {
      if(cell.type === 3 &&vals<0)
        return true;
      return false;
    },
  },
  props: ['mdTitle','mparams'],
  filters: {
    formartObj: function(values,cell){
      if (cell.type === 3) {
        let pit = cell.ccPoint>0 ? cell.ccPoint:2;
        let num = parseFloat( values === '' ? 0 : values)
        if (num === 0) {
          return 0;
        } else {
          return common.formatDecimal(values,{precision: pit});
        } 
      }
      return values;
    }
  },
  mounted () {
    if(this.mparams){
      this.initUI()
      console.log('bill-mounted')
    }
  },
  watch: {
    'mparams': function () {
      if(this.mparams){
        this.initUI()
        console.log('bill-change')
      }
    }
  },
};