'use client'

import { IoBookOutline } from 'react-icons/io5'
import { RiUserLocationLine } from 'react-icons/ri'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Select } from 'antd'
import CheckInModal from '@/components/CheckInModal'
import React from 'react'
import CheckOutModal from '@/components/CheckOutModal'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const data = [
  { date: '1/1/2024', quantity: 10 },
  { date: '2/1/2024', quantity: 11 },
  { date: '3/1/2024', quantity: 8 },
  { date: '4/1/2024', quantity: 15 },
  { date: '5/1/2024', quantity: 6 },
  { date: '6/1/2024', quantity: 23 },
  { date: '7/1/2024', quantity: 53 },
  { date: '8/1/2024', quantity: 13 },
  { date: '9/1/2024', quantity: 5 },
]

const chartData = {
  labels: data.map((item) => item.date),
  datasets: [
    {
      label: 'Số người ra vào',
      data: data.map((item) => item.quantity),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
}

const Home = () => {
  return (
    <>
      <CheckInModal isOpen onClose={() => {}}/>
      <CheckOutModal isOpen onClose={() => {}}/>
      <div className="flex-1 flex flex-col p-8">
        <div className="grid grid-cols-4 gap-x-8">
          <div className="rounded-2xl bg-[#FFE2E5] w-[200px] h-[200px] mx-auto flex flex-col justify-between p-5">
            <div className="h-10 w-10 rounded-full bg-[#FA5A7D] flex items-center justify-center">
              <RiUserLocationLine className="text-white text-[22px]" />
            </div>
  
            <span className="text-[#151D48] text-3xl font-bold">19</span>
            <span className="text-[#425166]">Người đang trong thư viện</span>
          </div>
  
          <div className="rounded-2xl bg-[#FFF4DE] w-[200px] h-[200px] mx-auto flex flex-col justify-between p-5">
            <div className="h-10 w-10 rounded-full bg-[#FF947A] flex items-center justify-center">
              <IoBookOutline className="text-white text-[22px]" />
            </div>
  
            <span className="text-[#151D48] text-3xl font-bold">80</span>
            <span className="text-[#425166]">Quyển sách đang được mượn</span>
          </div>
  
          <div className="rounded-2xl bg-[#FFF4DE] w-[200px] h-[200px] mx-auto flex flex-col justify-between p-5">
            <div className="h-10 w-10 rounded-full bg-[#FF947A] flex items-center justify-center">
              <IoBookOutline className="text-white text-[22px]" />
            </div>
  
            <span className="text-[#151D48] text-3xl font-bold">80</span>
            <span className="text-[#425166]">Quyển sách đang được mượn</span>
          </div>
  
          <div className="rounded-2xl bg-[#FFF4DE] w-[200px] h-[200px] mx-auto flex flex-col justify-between p-5">
            <div className="h-10 w-10 rounded-full bg-[#FF947A] flex items-center justify-center">
              <IoBookOutline className="text-white text-[22px]" />
            </div>
  
            <span className="text-[#151D48] text-3xl font-bold">80</span>
            <span className="text-[#425166]">Quyển sách đang được mượn</span>
          </div>
        </div>
  
        <div className="flex flex-col gap-y-10 mt-10 flex-1">
          <div className="flex justify-between">
            <h2 className="text-[#151D48] text-2xl font-bold">
              Thống kê số người ra vào thư viện
            </h2>
  
            <Select
              defaultValue="10"
              style={{ width: 120 }}
              options={[
                { value: '10', label: '10 Ngày' },
                { value: '15', label: '15 Ngày' },
                { value: '30', label: '1 Tháng' },
                { value: '60', label: '2 Tháng' },
                { value: '90', label: '3 Tháng' },
              ]}
            />
          </div>
  
          <div className="flex-1 relative">
            <div className="absolute top-0 left-0 right-0 bottom-0">
              <Line data={chartData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
