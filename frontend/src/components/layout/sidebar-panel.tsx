"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody } from "@/components/cult/sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// import { NavHeading } from '@/components/nav/nav-heading';
// import { NavSearchActions } from '@/components/nav/nav-blob-actions';
import { NavLinks } from '@/components/nav/nav-links';
// import { NavFooter } from '@/components/nav/nav-footer';

export function SidebarPanel({ children, user }) {
  const [open, setOpen] = useState(false);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-brand dark:bg-stone-800 h-full">
          <div className={cn("flex items-center py-1 relative z-20 mt-6", !open ? 'pl-6' : 'pl-5')}>
            {open ? <Logo /> : <LogoIcon />}
          </div>
          {/* <NavHeading isCollapsed={!open} /> */}
          {/* <NavSearchActions isCollapsed={!open} /> */}
          <NavLinks isCollapsed={!open} />
          <div className={cn(!open ? 'pl-4' : 'pl-3')}>{children}</div>
          {/* <NavFooter isCollapsed={!open} user={user} /> */}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="flex space-x-2 items-center text-sm"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-base text-xl text-black dark:text-white whitespace-pre"
      >
        Reach AI
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="flex space-x-2 items-center text-sm"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};