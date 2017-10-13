import common from '../../core/utils/common.js';
export default {
  data(){
    return {
    }
  },
  methods: {
    getCallBack(res){
      if (res.data.id >= 0) {
        this.layoutCel = res.data.data.layCels;
        this.subCellsCount = this.layoutCel.subLayCells ? this.layoutCel.subLayCells.length : 0;
        this.subLayCells =  this.subCellsCount >0 ? this.layoutCel.subLayCells[0]: null;
        this.initModal()
      }
    },
    initModal () {
      var user = JSON.parse(window.localStorage.getItem('user'));
      var deptInfo = user.deptInfo;
      for(let i = 0; i <  this.layoutCel.cels.length;i++) {
        var item = this.layoutCel.cels[i];
        // console.log(item.initValue)
        if(item.id == 'sid'){
          console.log(item);
          console.log(this.layoutCel);
        }
        let iniVl = item.initValue;
        if (iniVl == '[!]') {
          iniVl = deptInfo.deptCode;
        }
        if (iniVl == '[$]') {
          iniVl = user.userCode;
        }
        if (iniVl == '[#]') {
          iniVl = deptInfo.cmcCode;
        }
        if((iniVl == '[Y-M-D]' || iniVl === '0') && item.type === 91){
          iniVl = common.now('YYYY-MM-DD');
        }
        if((iniVl == '[Y-M-D]' || iniVl === '0') && item.type === 93){
          iniVl = common.now();
        }
        if(iniVl == '[YMD]'){
          iniVl = common.now('YYYYMMDD');
        }
        if(iniVl == '[YM]'){
          iniVl = common.now('YYYYMM');
        }
        if(iniVl == '[Y2M]'){
          iniVl = common.now('YYMM');
        }
        if(iniVl == '[Y-M]'){
          iniVl = common.now('YYYY-MM');
        }
        if(item.type==5){
          iniVl = parseInt(iniVl);
        }
        // this.modal[item.id] = iniVl;
        this.$set(this.modal,item.id,iniVl);
      } 
    },
  }
}