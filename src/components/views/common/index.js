import mdBipRef from './mdBipRef';
import mdBipInput from './mdBipInput';
import mdBipNotify from './mdBipNotify';
import mdBipGrid from './mdBipGrid';
import mdBipEnum from './mdBipEnum';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.use(mdBipRef);
  Vue.use(mdBipInput);
  Vue.use(mdBipGrid);
  Vue.use(mdBipEnum);
  Vue.prototype.$notify = mdBipNotify
}
