"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BarChart,
  MapPin,
  Bookmark
} from "lucide-react"

export default function LottoNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "홈", icon: <Home size={20} /> },
    { href: "/lotto-chart", label: "통계", icon: <BarChart size={20} /> },
    { href: "/lotto-spots", label: "명당", icon: <MapPin size={20} /> },
    { href: "/lotto-saving", label: "저장", icon: <Bookmark size={20} /> },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t  border-gray-200 flex justify-around py-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const activeColor = isActive ? "text-black" : "text-gray-500"

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs font-medium ${activeColor} mt-1 mb-5`}
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}