import { NavLink } from "react-router-dom";
import type { MenuProps } from "antd";
import { TUserPath } from "../types";

// Define MenuItem type from antd
type MenuItem = Required<MenuProps>["items"][number];

export const sidebarItemsGenerator = (items: TUserPath[]): MenuItem[] => {
  const sidebarItems = items.reduce((acc: MenuItem[], item) => {
    // Push top-level items
    if (item.path && item.name) {
      acc.push({
        key: item.name,
        icon: item.icon,
        label: <NavLink to={`/${item.path}`}>{item.name}</NavLink>,
      });
    }

    // Handle nested children
    if (item.children && item.children.length > 0) {
      const childItems = item.children
        .filter((child) => child.name && child.path) // Filter out invalid children
        .map((child) => ({
          key: child.name!,
          label: <NavLink to={`/${child.path}`}>{child.name}</NavLink>,
        })) as MenuItem[]; // Cast as MenuItem[] to ensure type safety

      if (childItems.length > 0) {
        acc.push({
          key: item.name as string,
          label: item.name,
          children: childItems,
        });
      }
    }

    return acc;
  }, []);

  return sidebarItems;
};
