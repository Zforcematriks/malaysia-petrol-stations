'use client';
import React from "react";
import { FaGasPump, FaMapMarkerAlt, FaOilCan } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Brand", icon: <FaGasPump />, href: "/brand" },
  { label: "Stations", icon: <FaMapMarkerAlt />, href: "/stations" },
  { label: "Prices", icon: <FaOilCan />, href: "/prices" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center text-xs transition-all duration-200 font-semibold h-16 px-2 -webkit-tap-highlight-color-transparent touch-action-manipulation ${
                  isActive
                    ? "text-black font-bold border-b-2 border-gray-800 bg-gray-50"
                    : "text-gray-700 hover:text-black active:bg-gray-100"
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
} 