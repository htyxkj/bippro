import common from '../../core/utils/common.js';
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
      modal: {},
      mdAutoSelect: false,
      mdSelection: false,
      selectData:[],
      subCellsCount: 0
    }
  },
  methods: {
    create() {
      this.$emit('create');
    },
    list() {
      this.$emit('list');
    },
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
        this.subCellsCount = this.layoutCel.subLayCells ? this.layoutCel.subLayCells.length : 0;
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
    onTableSelect(item){
      this.selectData = item;
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
  },
  props: ['mdTitle','mparams'],
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
};