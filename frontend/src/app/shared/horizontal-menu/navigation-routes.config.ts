import { RouteInfo } from '../vertical-menu/vertical-menu.metadata';

export const HROUTES: RouteInfo[] = [
  {
    path: '/dashboard', title: 'แดชบอร์ด', icon: 'ft-home', class: 'dropdown nav-item', isExternalLink: false, submenu: []
  },
  {
    path: 'seals', title: 'จัดการซีล', icon: 'ft-grid', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { path: '/seals/sealin', title: 'นำซีลเข้าระบบ', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/seals/sealout', title: 'จ่ายซีล', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  {
    path: '/page', title: 'Page', icon: 'ft-home', class: 'dropdown nav-item', isExternalLink: false, submenu: []
  },
];
