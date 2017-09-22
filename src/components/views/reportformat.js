import common from '../core/utils/common.js';
export default {
  data () {
    return {
      showCont: false,
      showContLabel: '显示条件'
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
  methods: {
    showSearchInfo () {
      this.showCont = !this.showCont;
      this.showContLabel = this.showCont ? '隐藏条件' : '显示条件';
    }
  },
  computed: {
  }
};