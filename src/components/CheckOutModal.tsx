import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@mui/material'
import { Button, Input } from 'antd'
import { FC, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'
import { z } from 'zod'

interface CheckOutModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormValues {
  studentId: string
  studentName: string
  studentClass: string
  studentBirthday: string
}

const CheckOutModal: FC<CheckOutModalProps> = ({ isOpen, onClose }) => {
  const schema = useMemo(
    () =>
      z.object({
        studentId: z.string().min(1, 'Mã sinh viên không được để trống'),
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
      open={true}
      onClose={onClose}
      className="flex items-center justify-center !z-[100]"
    >
      <div className="w-screen max-w-[500px] p-5 bg-white rounded-lg flex flex-col outline-none">
        <div className="grid grid-cols-[50px,1fr,50px]">
          <div></div>
          <span className="text-center mx-auto text-2xl font-bold">Ra khỏi thư viện</span>
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

          <Button className="w-full mt-2" type="primary">
            Check Out
          </Button>
        </form>
      </div>
    </Modal>
  )
}

export default CheckOutModal
