import common from '../../core/utils/common.js';
import qs from 'qs'
import billS from './billState';
export default {
  data(){
    return {
      // billState: {
      //   INSERT: 1, //--新增
      //   EDITED: 2, //值改变
      //   DELETE: 4, //加删除标志
      //   EDITSUB: 8, //字表改变
      //   EDITEDPK: 0x10, //主键改变
      //   IMPORT: 0x20, //这主要用于导入记录(结合INSERT使用,保存时先做更新,不存在时再做插入)
      //   REPLACESUB: 0x40, //(替换子表)修改前先删除子表
      //   HISTORY: 0x80,//历史数据(仅做为显示用)
      //   COPY: 0x100,//从其它记录拷贝过来
      //   DICT: 0x200,//记录经过动态字典处理后,置上该标记。
      //   POSTED: 0x400 ////记录已提交过
      // },
      billState: billS,
      billState1:0,
      subDatas:[],
    }
  },
  props:{history:false,myModal:Object},
  methods: {
    initUIData(){
      console.log('uiData');
      this.subLayCells={};
      this.subDatas = [];
      this.modal = {};
      // this.$set(this.modal,sys_stated,this.billState.DICT | this.billState.HISTORY);
      // this.c_state = this.billState.DICT| this.billState.INSERT;
    },
    getCallBack(res){
      if (res.data.id >= 0) {
        this.layoutCel = res.data.data.layCels;
        this.subCellsCount = this.layoutCel.subLayCells ? this.layoutCel.subLayCells.length : 0;
        this.subLayCells =  this.subCellsCount >0 ? this.layoutCel.subLayCells[0]: null;
        console.log('hs',this.history)
        if(!this.history){
          this.initModal();
        }else{
          _.forEach(this.myModal,(n,key) => {
            this.$set(this.modal,key,n);
          });
          if(this.layoutCel.haveChild){
            this.getChildData(this.modal);
          }
          this.$set(this.modal,sys_stated,this.billState.DICT | this.billState.HISTORY);
          // this.modal.sys_stated = this.billState.DICT | this.billState.HISTORY;
        }
        if(this.subCellsCount>0){
          if(this.$refs.grid){
            var cols = [];
            _.forEach(this.subLayCells.cels,(cell,index)=>{
              var col = {field:cell.id, dataType:this.getDataType(cell), label:cell.labelString, editable:true,hidden:!cell.isShow};
              cols.push(col);
            });
            this.$refs.grid.setColumns(cols);
            this.$refs.grid.refreshStatus();
          }
        }
      }
      this.loading--;
    },
    getDataType(item){
      if(item.type == 91 || item.type == 93) {
        return 'date';
      }
      if(item.type<12){
        return 'numeric';
      }
      if(item.assist){
        return 'entity';
      }
      if(item.editType===1){
        return 'enum';
      }
      return 'string';
    },
    createDataModal(cell,modal){
      var user = JSON.parse(window.localStorage.getItem('user'));
      var deptInfo = user.deptInfo;
      _.forEach(cell.cels,(item,index)=>{
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
        if(item.type<=5){
          if(iniVl == undefined)
            iniVl = 0;
          else{
            iniVl = parseInt(iniVl);
          }
        }
        this.$set(modal,item.id,iniVl);
      });
      return modal;

    },
    initModal () {
      var user = JSON.parse(window.localStorage.getItem('user'));
      var deptInfo = user.deptInfo;
      let xinc = this.layoutCel.autoInc;
      if(xinc>0)
        xinc = xinc-1;
      let cel = this.layoutCel.cels[xinc];
      // // console.log(xinc,cel)
      // // console.log(this.modal[cel.id]);
      // this.modal.sys_stated = this.billState.DICT;
      this.$set(this.modal,'sys_stated',this.billState.DICT);
      if (xinc >=0 && !this.modal[cel.id]){
        // this.modal.sys_stated = this.modal.sys_stated | this.billState.INSERT;
        this.$set(this.modal,'sys_stated',(this.modal.sys_stated | this.billState.INSERT));
        // this.c_state = this.c_state | this.billState.INSERT;
      }
      this.modal = this.createDataModal(this.layoutCel,this.modal);
      _.forEach(this.modal,(key,index)=>{
        var bb = this.$refs[key];
        if(bb){
          var cc = bb[0].$refs[key];
          if(cc)
            cc.parentChange();
        }
      });
      if ((this.modal.sys_stated & this.billState.INSERT) >0){
        this.incCalc(this.layoutCel);
      }
    },
    incCalc(cell){
      if(cell){
        let xinc = cell.autoInc;
        // console.log(xinc,'incCal');
        if(xinc > 0){
          var cel = cell.cels[xinc-1] ;
          var s0 = cel.psAutoInc ;
          // console.log(s0);
          if (s0 == null || s0 == undefined || s0.length < 1 || cel.type !== 12)
            return;
          let ilnk = cel.lnk_inn;
          // console.log('ilink',ilnk);
          s0 = this.incCalc2(cell.cels,s0,ilnk,this.modal);
          if ((cel.attr & 0x10000) == 0) {
            var x0 = s0.lastIndexOf('%');
            s0 = x0 <1 ? s0 : s0.substring(0, x0 + 1);
          }
          this.$set(this.modal,cel.id,s0);
        }
      }
    },
    incCalc2(cells,sinc,ilnk,modalV){
      let x0 = sinc.indexOf('\r'),x1;
      if (x0 > 0)
        sinc = sinc.substring(0, x0);
      var cc = sinc.charAt(0);
      if(cc == '['){
        sinc = sinc.substring(1,sinc.length-1);
      }
      // console.log(sinc);
      sinc = this.formatVars(sinc);
      // console.log(sinc);
      // 处理其他关联
      x0 = sinc.indexOf('%');
      if (x0 >= 0) {
        while (x0 >= 0 && ilnk != 0) {
          x1 = (ilnk & 0xFF) - 1;
          if (x1 < 0){
            console.log(sinc + " autoinc innlink(-1)")
          }
          var refCel = cells[x1];
          var vv = modalV[refCel.id];
          sinc = sinc.substring(0, x0) + this.incCalca(refCel,(ilnk >>> 8) & 0xFF,vv,x1)+sinc.substring(x0 + 1);
          x0 = sinc.indexOf('%', x0);
          ilnk >>>= 16;
        }
      }
      return sinc;
    },
    incCalca(cel,iinc,orf,xdep){
      var t0 = iinc & 0xF0;
      var s0 = '';
      // console.log(cel,iinc,orf,xdep);
      if(t0 == 16){
        // console.log(orf);
        var bb = common.getDate(orf,'YY');
        if (bb.indexOf('Invalid')>-1){
          orf = common.now();
        }
        if ((iinc & 2) !== 0){
          s0 += common.getDate(orf,'YY');
        }else if((iinc & 1) !== 0){
          s0 += common.getDate(orf,'YYYY');
        }
        if((iinc & 4) !== 0){
          s0 += common.getDate(orf,'MM');
        }
        if((iinc & 8) !== 0){
          s0 += common.getDate(orf,'DD');
        }
        return s0;
      }
      if (orf == null)
        return "0";
      s0 = orf+'';
      return s0;
    },
    formatVars(sinc){
      var user = JSON.parse(window.localStorage.getItem('user'));
      var deptInfo = user.deptInfo;
      sinc = sinc.replace(/\[!\]/g,deptInfo.deptCode);
      sinc = sinc.replace(/\[#\]/g,deptInfo.cmcCode);
      sinc = sinc.replace(/\[$\]/g,user.userCode);
      sinc = sinc.replace(/\[Y2M\]/g,common.now('YYMM'));
      sinc = sinc.replace(/\[YM\]/g,common.now('YYYYMM'));
      sinc = sinc.replace(/\[YMD\]/g,common.now('YYYYMMDD'));
      return sinc;
    },
    save(){
      this.loading=1;
      // var state = this.billState.DICT;
      if((this.modal.sys_stated & this.billState.INSERT)>0){
        this.modal.sys_stated = 3;
        this.$set(this.modal,'sys_stated',3);
      }
      if(this.subCellsCount>0){
        var cc = this.layoutCel.subLayCells[0];
        this.$set(this.modal,cc.obj_id,this.subDatas);
      }
      var str = JSON.stringify(this.modal);
      var isnull = this.checkNotNull();
      if(!isnull){
        var options = {'pcell': this.mparams.pcell, 'jsonstr': str};
        this.saveData(options,this.saveSuccess,this.saveErr);
      }
    },
    delData(){
      this.modal.sys_stated = 4;
      var str = JSON.stringify(this.modal);
      var options = {'pcell': this.mparams.pcell, 'jsonstr': str};
      this.saveData(options,this.saveSuccess,this.saveErr);
    },
    saveSuccess(res){
      console.log(res,'save');
      if(res.data.id == 0){
        if((this.modal.sys_stated & this.billState.INSERT)>0){
          var data = res.data.data;
          var _self = this;
          _.forEach(data, function(val, key) {
            // console.log(val, key);
            _self.$set(_self.modal,key,val);
          });
          this.modal.sys_stated  = this.billState.POSTED;
          console.log(this.modal.sys_stated);
        }
        if((this.modal.sys_stated & this.billState.DELETE)>0) {
          this.$notify.success({content: '删除成功！'});
          this.modal = {};
          this.initModal();
          return ;
        }else{
          this.$notify.success({content: '保存成功！'});
        }
      }else{
        console.log(res);
        this.$notify.danger({content: res.data.message});
      }
      this.loading--;
    },
    saveErr(res){
      console.log(res);
      this.loading--;
    },
    checkNotNull(){
      for(let i=0;i<this.layoutCel.cels.length;i++){
        var item = this.layoutCel.cels[i];
        if(item.unNull){
          var vl = this.modal[item.id];
          if(typeof vl == 'number'){
            continue;
          }
          if (vl == undefined || vl == '') {
            this.$notify.warning({content: "【"+ item.labelString+"】不能为空！", placement:'mid-center'});
            return true;
          }
        }
      }
      return false;
    }
  },
  mounted () {
    if(this.mparams){
      this.initUI()
    }
  },
  watch: {
    'mparams': function () {
      if(this.mparams){
        this.initUIData();
        this.initUI();
      }
    },
    'modal': function(){
      console.log('modal change');
    }
  },
}