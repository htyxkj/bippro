import ReportUI from './reportLayUI';
import Common from './common';

export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }

  install.installed = true;
  Vue.use(Common);
  Vue.component('md-report-ui', ReportUI);

}
