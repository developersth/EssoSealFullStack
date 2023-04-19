import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard', title: 'แดชบอร์ด', icon: 'ft-home', class: 'dropdown nav-item', isExternalLink: false, submenu: []
  },
  {
    path: 'seals', title: 'จัดการซีล', icon: 'ft-grid', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/seals/sealin', title: 'รายการนำซีลเข้าระบบ', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/seals/sealout', title: 'การจ่ายซีล', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/seals/sealoutlist', title: 'รายการจ่ายซีล', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  {
    path: '', title: 'Forms', icon: 'ft-edit', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      {
        path: '', title: 'Elements', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/forms/inputs', title: 'Inputs', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/input-groups', title: 'Input Groups', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/radio', title: 'Radio', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/checkbox', title: 'Checkbox', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/switch', title: 'Switch', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/select', title: 'Select', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/editor', title: 'Editor', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/tags', title: 'Input Tags', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/datepicker', title: 'Datepicker', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/timepicker', title: 'Timepicker', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
        ]
      },
      { path: '/forms/layout', title: 'Layouts', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/forms/validation', title: 'Validation', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/forms/archwizard', title: 'Wizard', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
    ]
  },
  {
    path: '/page', title: 'Page', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
  },

];
