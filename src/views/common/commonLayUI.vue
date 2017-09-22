<template>
  <div>
    <app-ui v-if="mparams&&mparams.beBill" :mdTitle="menuTitle" :mparams="mparams"></app-ui>
    <md-report-ui v-else :mdTitle="menuTitle" :mparams="mparams"></md-report-ui>
  </div>
</template>

<script>
import AppletLayUI from './bill/appletLayUI';
export default {
  data () {
    return {
      pbuid: '',
      pmenuid: '',
      menuTitle: '',
      mparams: {}
    }
  },
  methods: {
    fetchParams () {
      this.pbuid = this.$route.query.pbuid
      this.pmenuid = this.$route.query.pmenuid
      this.menuTitle = this.$route.query.title
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.localStorage.getItem('user')).userCode,
        'apiId': global.APIID_MPARAMS,
        'pbuid': this.pbuid,
        'pmenuid': this.pmenuid
      }
      if(this.pbuid && this.pmenuid){
        this.getDataByAPINew(data1,this.getCallBack,this.getCallError)
      }
    },
    getCallBack(res){
      // 获取返回值
      this.mparams = res.data.data.mparams
    },
    getCallError(res) {
      console.log(res)
    }
  },
  components: {'app-ui': AppletLayUI},
  watch: {
    '$route': ['fetchParams']
  },
  mounted () {
  },
  created () {
    this.fetchParams()
  }
}
</script>

