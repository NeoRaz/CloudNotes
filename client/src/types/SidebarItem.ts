export interface SidebarItem {
  label: string;
  link?: string;
  icon?: string;
  submenu?: boolean;
  submenuItems?: SidebarItem[];
}