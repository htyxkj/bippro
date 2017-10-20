<template>
  <md-input-container>
    <label :for="cell.id">{{cell.labelString}}</label>
    <md-select :name="cell.id" :id="cell.id" v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled" @change="dataCC">
      <md-option :value="item[header[0]]" v-for="(item,index) in values" :key="index">{{item[header[1]]}}</md-option>
    </md-select>
  </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  data(){
    return {
      header:[],
      values:[]
    }
  },
  methods:{
    doQuery(){
      // console.log(this.cell.refValue)
      if (this.cell.refValue) {
        if (this.cell.refValue.indexOf('$')>0 || this.cell.refValue.indexOf('&')>0  ){
          this.getAssistDataByAPI(this.cell.refValue,this.getCallBack,this.getCallError);
        }else{
          this.header = ['code','name'];
          var selectList = this.cell.refValue.split(';');
          // console.log(selectList)
          _(this.values).take(0);
          for(let i=0;i<selectList.length;i++){
            var key = selectList[i];
            var datas = key.split(':');
            var code = this.cell.type< 12 ? datas[0] : (datas[0]+'');
            var item = {'code':code,'name':datas[1]};
            this.values.push(item);
          }
        }
        
      }
    },
    getCallBack(res){
      // console.log(res.data);
      var data = res.data;
      if(data.code==-1){
        this.$notify.danger({content: data.message});
      }else{
        var len = data.labers.length;
        if(len>1){
          for(let i=0;i<2;i++){
            this.header[i] = data.allCols[data.showCols[i]];
          }
        }else{
          this.header[0] = data.labers[0];
          this.header[1] = data.labers[0];
        }
        if(data.code==1){
          this.values = data.values;
        }
      }
    },
    getCallError(res){
      this.$notify.danger({content: res.data.message});
    },
    dataCC(value){
      // console.log(value+'');
      var refBackData = {
          cellId:this.cell,
          value:value,
          multiple:false
      };
      if(value !== this.modal[this.cell.id])
        this.$emit('change',refBackData);
    }
  },
  mounted () {
    if(this.cell) {
      let notedit = this.cell.attr&this.NOTEDIT;
      this.disabled = notedit > 0 ? true:false;
      this.doQuery();
    }  
  }
}
</script>