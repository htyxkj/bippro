import mdBipBill from './mdBipBill.vue';
import mdBipBillInfo from './mdBipBillInfo.vue';
import mdBipBillList from './mdBipBillList.vue';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-bill', mdBipBill);
  Vue.component('md-bip-bill-info', mdBipBillInfo);
  Vue.component('md-bip-bill-list', mdBipBillList);
}
