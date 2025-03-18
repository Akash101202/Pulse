import {
  BellIcon,
  CreditCardIcon,
  HomeIcon,
  LibraryIcon,
  SettingsIcon,
} from "lucide-react";
import React from "react";

export const MENU_ITEMS = (
  workspaceId: string
): { title: string; href: string; icon: React.ReactNode }[] => [
  { title: "Home", href: `/dashboard/${workspaceId}/home`, icon: <HomeIcon /> },
  {
    title: "My Library",
    href: `/dashboard/${workspaceId}`,
    icon: <LibraryIcon />,
  },
  {
    title: "Notifications",
    href: `/dashboard/${workspaceId}/notifications`,
    icon: <BellIcon />,
  },
  {
    title: "Billing",
    href: `/dashboard/${workspaceId}/billing`,
    icon: <CreditCardIcon />,
  },
  {
    title: "Settings",
    href: `/dashboard/${workspaceId}/settings`,
    icon: <SettingsIcon />,
  },
];
