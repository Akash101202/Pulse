import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  href: string;
  selected: boolean;
  notification?: number;
};

const SidebarItem = ({ icon, title, href, selected, notification }: Props) => {
  return (
    <li className="cursor-pointer my-[5px] ">
      <Link
        className={cn(
          "flex items-center group rounded-lg hover:bg-[#1D1D1D]",
          selected ? "bg-[#1D1D1D]" : ""
        )}
        href={href}
      >
        <div className="flex items-center transition-all p-[5px] cursor-pointer ">
          {icon}
          <span
            className={cn(
              "font-medium group-hover:text-[#9D9D9D] transition-all truncate w-32 pl-2",
              selected ? "text-[#9D9D9D]" : "text-[#545454]"
            )}
          >
            {title}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
