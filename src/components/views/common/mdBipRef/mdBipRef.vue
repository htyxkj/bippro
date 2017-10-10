<template>
  <div class="md-bip-ref">{{refData.name | formartObj(bipRefId,refData.name)}}</div>
</template>
<script>
import common from '../../commonModal.js'
export default {
  data () {
    return {
      refData: {
        code:'',
        name: ''
      },
      showCols:''
    }
  },
  mixins:[common],
  props: {'inputValue':null,'bipRefId':Object,mdNumeric: Boolean},
  mounted () {
    if(this.inputValue)
      this.initValue();
  },
  watch: {
    'inputValue': function () {
      this.initValue();
    }
  },
  methods: {
    initValue(){
      this.refData.code = this.inputValue;
      this.refData.name = this.inputValue;
      if (this.bipRefId && this.bipRefId.refValue) {
        this.makeRefValue();
      }
    },
    makeRefValue(){
      var refvalue = JSON.parse(window.sessionStorage.getItem(this.bipRefId.refValue));
      let isexit = false;
      if (refvalue){
        isexit = this.makeRef(refvalue);
      }
      if(!isexit){
        this.getAssist(this.bipRefId.refValue,this.refData.code,this.getSuccCallBack,this.getErrorCallBack);
      }   
    },
    getSuccCallBack(res){
      // console.log('success返回');
      if(res.data.code==1){
        var refvalue = JSON.parse(window.sessionStorage.getItem(this.bipRefId.refValue));
        // console.log(res.data)
        this.showCols = res.data.allCols[0]
        if (refvalue){
          refvalue.values = this.checkUnqItem(refvalue.values,res.data.values);
        }else{
          refvalue = res.data;
        }
        this.makeRef(refvalue);
        refvalue.values = _.uniq(refvalue.values,this.showCols);
        // console.log(refvalue.values.length+ '===' + this.showCols);
        window.sessionStorage.setItem(this.bipRefId.refValue,JSON.stringify(refvalue));
      }else{
        // console.log('没有辅助：'+ this.bipRefId.refValue);
      }     
    },
    checkUnqItem(arr1,arr2){
      _.forEach(arr2,function(item){
        var _index = _.findIndex(arr1,item);
        if(_index<0){
          arr1.push(item);
        }
      });
      return arr1;
    },
    getErrorCallBack(res) {
      console.log(res);
    },
    makeRef(refvalue){
      var vls = refvalue.values;
      if(vls){
        for (let i = 0; i < vls.length; i++){
          var item = vls[i];
          if(item[refvalue.allCols[0]] === this.refData.code) {
            this.refData.name = item[refvalue.allCols[1]];
            this.$emit('makeRef',this.bipRefId.id,this.refData);
            return true;
          }
        }
      }
      this.$emit('makeRef',this.bipRefId,this.refData);
      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
.md-bip-ref{
  width: 100%;
  height: 100%;
}
</style>

