'use client'

import cn from '@/utils/cn'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BsBook } from 'react-icons/bs'
import { GoHome } from 'react-icons/go'
import { GrLogin } from 'react-icons/gr'
import { LiaHandHoldingSolid } from 'react-icons/lia'

const NAV_LINKS = [
  {
    path: '/',
    label: 'Trang chủ',
    icon: <GoHome className="text-3xl" />,
  },
  {
    path: '/books',
    label: 'Quản lý sách',
    icon: <BsBook className="text-2xl" />,
  },
  {
    path: '/lib-log',
    label: 'Quản vào thư viện',
    icon: <GrLogin className="text-[26px]" />,
  },
  {
    path: '/borrow',
    label: 'Quản lý mượn sách',
    icon: <LiaHandHoldingSolid className="text-[32px]" />,
  },
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="w-[355px] bg-white p-5 flex flex-col gap-y-10">
      <div className="flex items-center gap-x-6">
        <Image
          alt="Ptit Logo"
          src={'/img/ptit.png'}
          width={50}
          height={50}
          className="object-contain"
        />

        <h1 className="text-3xl font-semibold text-[#151D48]">Thư viện PTIT</h1>
      </div>

      <div className="flex flex-col gap-y-5">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.path}
            key={link.path}
            className={cn(
              'py-[14px] px-5 rounded-2xl grid gap-x-6 items-center grid-cols-[30px,1fr] text-[#737791]',
              {
                'bg-[#5D5FEF] text-white': pathname === link.path,
              }
            )}
          >
            {link.icon}
            <span className="text-start text-[22px] font-semibold whitespace-nowrap">{link.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
