"use client";

import { useBorrowBookModal } from "@/components/BorrowBookModal";
import { useCheckIn } from "@/components/CheckInModal";
import { useCheckOut } from "@/components/CheckOutModal";
import useExpiredCount from "@/hooks/useExpiredCount";
import useLibList from "@/hooks/useLibList";
import useLibStats from "@/hooks/useLibStats";
import useTransList from "@/hooks/useTransList";
import { Select, Spin } from "antd";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import { BiLogOut, BiMapPin } from "react-icons/bi";
import { FaClockRotateLeft } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import { LiaHandHoldingSolid } from "react-icons/lia";
import { RiUserLocationLine } from "react-icons/ri";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const Home = () => {
  const { open: openCheckIn } = useCheckIn();
  const { open: openCheckOut } = useCheckOut();
  const { open: borrowBook } = useBorrowBookModal();

  const { libData } = useLibList();
  const { transData } = useTransList();
  const { expiredCount } = useExpiredCount();

  const { statsData, dayNumber, setDayNumber, isLoading } = useLibStats();

  const chartData = {
    labels: statsData.map((item) =>
      dayjs(item.timestamp * 1000).format("DD/MM/YYYY"),
    ),
    datasets: [
      {
        label: "Số người ra vào",
        data: statsData.map((item) => item.check_in_count),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex-1 flex flex-col p-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-8 gap-y-8">
        <Link
          href={"/lib-log"}
          className="rounded-2xl bg-[#FFE2E5] w-[180px] h-[180px] mx-auto flex flex-col justify-between p-5"
        >
          <div className="h-10 w-10 rounded-full bg-[#FA5A7D] flex items-center justify-center">
            <RiUserLocationLine className="text-white text-[22px]" />
          </div>

          <span className="text-[#151D48] text-3xl font-bold">
            {libData?.total_elements ?? 0}
          </span>
          <span className="text-[#425166]">Người đang trong thư viện</span>
        </Link>

        <Link
          href={"/borrow"}
          className="rounded-2xl bg-[#FFF4DE] w-[180px] h-[180px] mx-auto flex flex-col justify-between p-5"
        >
          <div className="h-10 w-10 rounded-full bg-[#FF947A] flex items-center justify-center">
            <IoBookOutline className="text-white text-[22px]" />
          </div>

          <span className="text-[#151D48] text-3xl font-bold">
            {transData?.total_elements ?? 0}
          </span>
          <span className="text-[#425166]">Quyển sách đang được mượn</span>
        </Link>

        <div className="rounded-2xl bg-[#FFF4DE] w-[180px] h-[180px] mx-auto flex flex-col justify-between p-5">
          <FaClockRotateLeft className="text-3xl text-[#E74C3C]" />

          <span className="text-[#151D48] text-3xl font-bold">
            {expiredCount}
          </span>

          <span className="text-[#425166]">Lượt mượn hết hạn chưa trả</span>
        </div>

        <button
          onClick={openCheckIn}
          className="rounded-2xl w-[180px] h-[180px] bg-[#DCFCE7] flex flex-col items-center justify-center gap-y-5 mx-auto"
        >
          <BiMapPin className="text-3xl text-[#27AE60]" />
          <span className="text-[#151D48] text-[26px] font-bold">Check In</span>
        </button>

        <button
          onClick={openCheckOut}
          className="rounded-2xl w-[180px] h-[180px] bg-[#F3E8FF] flex flex-col items-center justify-center gap-y-5 mx-auto"
        >
          <BiLogOut className="text-3xl text-[#8E44AD]" />
          <span className="text-[#151D48] text-[26px] font-bold">
            Check Out
          </span>
        </button>

        <button
          onClick={borrowBook}
          className="rounded-2xl w-[180px] h-[180px] bg-[#b0dcea] flex flex-col items-center justify-center gap-y-5 mx-auto"
        >
          <LiaHandHoldingSolid className="text-3xl text-[#2E86C1]" />
          <span className="text-[#151D48] text-[26px] font-bold">
            Mượn sách
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-y-10 mt-10 flex-1">
        <div className="flex justify-between">
          <h2 className="text-[#151D48] text-2xl font-bold">
            Thống kê số người ra vào thư viện
          </h2>

          <Select
            style={{ width: 120 }}
            options={[
              { value: 10, label: "10 Ngày" },
              { value: 15, label: "15 Ngày" },
              { value: 30, label: "1 Tháng" },
              { value: 60, label: "2 Tháng" },
              { value: 90, label: "3 Tháng" },
            ]}
            value={dayNumber}
            onChange={setDayNumber}
          />
        </div>

        <div className="flex-1 relative">
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <Line data={chartData} options={options} />
          </div>
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white/50">
              <Spin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
