import ReportUI from './report';
import Common from './common';
import Bill from './bill';

export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }

  install.installed = true;
  Vue.use(Common);
  Vue.use(ReportUI);
  Vue.use(Bill);

}
