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

const BlackHoleSVG = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    className={className}
  >
    <title>blackhole</title>
    <g data-name="Layer 39">
      <path d="M62.5,32c0,1.09961-.01056,1.71521-14.65814,2.12634a15.98147,15.98147,0,0,1-31.68372,0C1.51056,33.71528,1.5,33.09956,1.5,32c0-1.03613,0-1.50879,9.544-1.94043a6.97851,6.97851,0,0,0,6.17285-4.18066,16.00054,16.00054,0,0,1,29.5664,0A6.9788,6.9788,0,0,0,52.957,30.05958C62.5,30.49122,62.5,30.96388,62.5,32ZM45.81732,34.17518c-.67554.01526-1.35028.03064-2.04028.0437a11.98068,11.98068,0,0,1-23.55408,0c-.69006-.01306-1.36474-.02844-2.04028-.0437a13.98519,13.98519,0,0,0,27.63464,0Zm6.19928-2.1947a8.93949,8.93949,0,0,1-7.081-5.33594,14.00055,14.00055,0,0,0-25.8711,0,8.93949,8.93949,0,0,1-7.08105,5.33594c1.47363.06152,3.16211.11914,5.09277.16992,4.709.11719,9.87012.17969,14.92383.17969s10.21484-.0625,14.9248-.17969C48.85547,32.09962,50.544,32.042,52.0166,31.98048ZM43.57,28.83a11.99515,11.99515,0,0,0-23.14,0l-.04.12a1.0188,1.0188,0,0,0,.15.88,1.03467,1.03467,0,0,0,.79.41c3.52.06,7.11.09,10.67.09s7.15-.03,10.67-.09a1.03467,1.03467,0,0,0,.79-.41,1.0188,1.0188,0,0,0,.15-.88Z" />
    </g>
  </svg>
);

export const Logo = () => {
  return (
    <Link href="#" className="flex space-x-2 items-center text-sm">
      <motion.div
        initial={{ rotate: 45 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.5 }}
        className="h-8 w-8 flex-shrink-0"
      >
        <BlackHoleSVG className="w-full h-full fill-black dark:fill-white" />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-base text-3xl text-black dark:text-white whitespace-pre"
      >
        Magi
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link href="#" className="flex space-x-2 items-center text-sm">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 45 }}
        transition={{ duration: 0.5 }}
        className="h-8 w-8 flex-shrink-0"
      >
        <BlackHoleSVG className="w-full h-full fill-black dark:fill-white" />
      </motion.div>
    </Link>
  );
};