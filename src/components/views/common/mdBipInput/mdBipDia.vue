<template>
  <md-dialog ref="dialog"  @close="onRefClose" class="md-refs-dialog">
      <md-toolbar>
        <h1 class="md-title">{{title}}选择</h1>
        <md-input-container class="md-flex md-header-search">
          <md-input class="md-header-search-input"  placeholder="search" @keyup.enter.native="doQuery(word)" v-model="word"></md-input>
          <md-button class="md-icon-button md-inset" @click="doQuery(word)">
            <md-icon>search</md-icon>
          </md-button>
        </md-input-container>
        <md-button class="md-icon-button" @click.native="cancel()">
          <md-icon>close</md-icon>
        </md-button>
      </md-toolbar>
      <md-dialog-content class="no-padding">
        <md-table ref="table" @select="selectedRow" :multiple="false" :md-selection="mdSelection">
          <md-table-header>
            <md-table-row>
              <md-table-cell>
                ID
              </md-table-cell>
              <md-table-cell>
                name
              </md-table-cell>
              <md-table-cell>
                price
              </md-table-cell>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="(row, rowIndex) in refData" 
              :key="rowIndex" 
              :md-item="row"
              :md-selection="mdSelection" md-auto-select>
              <md-table-cell v-for="(column, columnIndex) in row" :key="columnIndex">
                {{column}}
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-dialog-content>
      <md-dialog-actions>
        <md-table-pagination
          :md-size="pageInfo.size"
          :md-total="pageInfo.total"
          :md-page="pageInfo.page"
          :md-page-options="[10 ,20]"
         >
        </md-table-pagination>
        <span class="flex"></span>
        <md-button class="md-accent md-raised" @click.native="close()">确定</md-button>
        <md-button class="md-warn" @click.native="cancel()">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
</template>

<script>

import axios from 'axios'

export default {
  props: {
    value: {
      type: Object,
    },
    multiple: {
      type: Boolean,
      default: true
    },
    mdMax: {
      type: Number,
      default: Infinity
    },
    mdPageSize:{
      type:[Number,String],
      default:'20'
    },
    mdRefId: String,
    options:{
      type:Object,
      default(){
        return {
          wheres:{},
          orders:{}
        }
      }
    },
    mdSelection:{
      type:Boolean,
      default:false
    },
    title:String
  },
  data(){
    return{
      word:'',
      refData:[],
      pageInfo:{
          size:this.mdPageSize,
          total:0,
          page:1
      },
      selectedRows:[],
      parentTable:''
    } 
  },
  methods:{
    open(){
      this.$refs['dialog'].open()
      this.doQuery('')
    },
    
    onRefClose(){

    },
    selectedRow(items){
      this.selectedRows.splice();
      for(var x in items){
        this.selectedRows[0] = items[x]
      }
    },

    doQuery(word){
      console.log(this.mdRefId);
      if (this.mdRefId) {
        this.getAssistDataByAPI(this.mdRefId,this.getCallBack,this.getCallError);
      }
      axios.get('http://jspang.com/DemoApi/oftenGoods.php')
      // axios.get('http://192.168.0.116:8888/bip')
      .then(response=>{
        this.refData = response.data.filter(o=>JSON.stringify(o).indexOf(word)>=0)
      })
    },
    getCallBack(res){

    },
    getCallError(res){

    },
    cancel(){
      this.$refs['dialog'].close();
      this.$emit('close',false);
    },
    close(){
      if(this.selectedRows){
        this.$emit('close',this.selectedRows);

      }
      this.$refs['dialog'].close();
    },
  },
  watch:{
    word(val){
      this.doQuery(val)
    },
  },
 
};
</script>
