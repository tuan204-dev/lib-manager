import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@mui/material'
import { Button, DatePicker, Input } from 'antd'
import React, { FC, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'
import { z } from 'zod'

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormValues {
  studentId: string
  studentName: string
  studentClass: string
  studentBirthday: string
}

const CheckInModal: FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const schema = useMemo(
    () =>
      z.object({
        studentId: z.string().min(1, 'Mã sinh viên không được để trống'),
        studentName: z.string().min(1, 'Tên sinh viên không được để trống'),
        studentClass: z.string().min(1, 'Lớp sinh viên không được để trống'),
        studentBirthday: z.string().min(1, 'Ngày sinh không được để trống'),
      }),
    []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <Modal
      open={false}
      onClose={onClose}
      className="flex items-center justify-center !z-[100]"
    >
      <div className="w-screen max-w-[500px] p-5 bg-white rounded-lg flex flex-col outline-none">
        <div className="grid grid-cols-[50px,1fr,50px]">
          <div></div>
          <span className="text-center mx-auto text-2xl font-bold">Vào thư viện</span>
          <button onClick={onClose} className="flex justify-end text-[#464646]">
            <IoMdClose className="text-3xl" />
          </button>
        </div>

        <form action="" className="mt-5 flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-1">
            <label htmlFor="student-id">Mã sinh viên</label>

            <Input
              id="student-id"
              placeholder="Vui lòng nhập mã sinh viên"
              className="border-error"
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="student-name">Tên</label>

            <Input id="student-name" placeholder="Vui lòng nhập tên sinh viên" />
          </div>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="student-class">Lớp</label>

            <Input id="student-class" placeholder="Vui lòng nhập lớp sinh viên" />
          </div>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="student-birthday">Ngày sinh</label>

            <DatePicker id="student-birthday" placeholder="Chọn ngày sinh" />
          </div>

          <Button className="w-full mt-2" type="primary">
            Check In
          </Button>
        </form>
      </div>
    </Modal>
  )
}

export default CheckInModal
