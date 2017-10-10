import mdBipInputComm from './mdBipInputComm'
import mdBipInputDate from './mdBipInputDate'
import mdBipInput from './mdBipInput.vue';
import mdBipInputRef from './mdBipInputRef.vue';
import mdBipDia from './mdBipDia.vue';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-input-comm',mdBipInputComm);
  Vue.component('md-bip-input-date',mdBipInputDate);
  Vue.component('md-bip-dia', mdBipDia);
  Vue.component('md-bip-input-ref', mdBipInputRef);
  Vue.component('md-bip-input', mdBipInput);
  

}
