"use client";
import LibService from "@/services/LibService";
import { ModalState } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@mui/material";
import { Button, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaStarOfLife } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { create } from "zustand";

interface FormValues {
  studentId: string;
}

export const useCheckOut = create<ModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

const schema = z.object({
  studentId: z.string().min(1, "Mã sinh viên không được để trống"),
});

const CheckOutModal = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { isOpen, close } = useCheckOut();

  const handleClose = () => {
    close();
    reset();
  };

  const onSubmit = async ({ studentId }: FormValues) => {
    try {
      await LibService.checkOut(studentId);
      toast.success("Check out thành công");
    } catch (e) {
      console.log(e);
      toast.error("Check out thất bại");
    } finally {
      handleClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      className="flex items-center justify-center !z-[100]"
    >
      <div className="w-screen max-w-[500px] p-5 bg-white rounded-lg flex flex-col outline-none">
        <div className="grid grid-cols-[50px,1fr,50px]">
          <div></div>
          <span className="text-center mx-auto text-2xl font-bold">
            Ra khỏi thư viện
          </span>
          <button
            onClick={handleClose}
            className="flex justify-end text-[#464646]"
          >
            <IoMdClose className="text-3xl" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-y-3"
        >
          <div className="flex flex-col gap-y-1">
            <label
              htmlFor="student-id"
              className="text-black/85 flex items-center"
            >
              Mã sinh viên{" "}
              <FaStarOfLife className="text-red-500 text-[10px] ml-1" />
            </label>

            <Controller
              name="studentId"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="student-id"
                  placeholder="Vui lòng nhập mã sinh viên"
                  className={errors.studentId ? "border-error" : ""}
                />
              )}
            />
          </div>

          <Button className="w-full mt-2" type="primary" htmlType="submit">
            Check Out
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default CheckOutModal;
