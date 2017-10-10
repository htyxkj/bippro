export default {
  methods: {
    create() {
      this.$emit('create');
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
    onTablePagination (pager) {
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.fetchUIData();
    },
    getCallBack(res){
      if (res.data.id >= 0) {
        this.layoutCel = res.data.data.layCels;
        this.subCellsCount = this.layoutCel.subLayCells ? this.layoutCel.subLayCells.length : 0;
        this.subLayCells =  this.subCellsCount >0 ? this.layoutCel.subLayCells[0]: null;
        this.pages = res.data.data.pages;
        this.pageInfo.page = this.pages.currentPage;
        this.pageInfo.total = this.pages.totalItem;
        this.pageInfo.size = this.pages.pageSize;
        // this.initModal()
        console.log(this.pages)
      }
    },
    dblclick (row) {
    },
  }
}