export default {
  data () {
    return {
      showCont: false,
      showContLabel: '显示条件'
    }
  },
  props: ['mdTitle','mparams'],
  methods: {
    showSearchInfo () {
      this.showCont = !this.showCont;
      this.showContLabel = this.showCont ? '隐藏条件' : '显示条件';
    }
  },
  watch:{
    'showCont':function(){
      this.showContLabel = this.showCont ? '隐藏条件' : '显示条件';
    }
  }
};