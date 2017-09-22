import mdBipRef from './mdBipRef';
import mdBipInput from './mdBipInput';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.use(mdBipRef);
  Vue.use(mdBipInput);
}
