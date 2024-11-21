"use client";
import LibService from "@/services/LibService";
import StudentService from "@/services/StudentService";
import { ModalState } from "@/types/common";
import cn from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@mui/material";
import { Button, DatePicker, Input } from "antd";
import dayjs from "dayjs";
import { floor, now } from "lodash";
import { Fragment, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { create } from "zustand";

interface FormValues {
  studentId: string;
  studentName: string;
  studentClass: string;
  studentBirthday: string;
}

export const useCheckIn = create<ModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

const CheckInModal = () => {
  const [step, setStep] = useState(1);

  const schema = useMemo(() => {
    if (step === 1) {
      return z.object({
        studentId: z.string().min(1, "Mã sinh viên không được để trống"),
      });
    }

    return z.object({
      studentId: z.string().min(1, "Mã sinh viên không được để trống"),
      studentName: z.string().min(1, "Tên sinh viên không được để trống"),
      studentClass: z.string().min(1, "Lớp sinh viên không được để trống"),
      studentBirthday: z
        .any()
        .refine((val) => !!val, { message: "Ngày sinh không được để trống" }),
    });
  }, [step]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { isOpen, close } = useCheckIn();

  const handleClose = () => {
    close();
    setStep(1);
    reset();
  };

  const onSubmit = async ({
    studentId,
    studentBirthday,
    studentClass,
    studentName,
  }: FormValues) => {
    try {
      if (step === 1) {
        const student = await StudentService.getInfo(studentId);

        if (!student) {
          toast.error(
            "Không tìm thấy sinh viên trong hệ thống. Vui lòng nhập thông tin sinh viên",
          );
          setStep(2);
        } else {
          await LibService.checkIn(studentId);
          toast.success("Check in thành công");
          handleClose();
        }
      } else {
        await StudentService.add({
          student_id: studentId,
          birthday: floor(new Date(studentBirthday).getTime() / 1000),
          name: studentName,
          student_class: studentClass,
        });

        await LibService.checkIn(studentId);
        toast.success("Check in thành công");
        handleClose();
      }
    } catch (e) {
      console.log(e);
      toast.error("Check in thất bại");
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
          <span className="text-center mx-auto text-[28px] font-bold">
            Vào thư viện
          </span>
          <button
            onClick={handleClose}
            className="flex justify-end text-[#464646] items-center"
          >
            <IoMdClose className="text-3xl" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-y-3"
        >
          <div className="flex flex-col gap-y-1">
            <label className="text-black/85" htmlFor="student-id">
              Mã sinh viên
            </label>

            <Controller
              name="studentId"
              control={control}
              render={({ field }) => (
                <Input
                  id="student-id"
                  placeholder="Vui lòng nhập mã sinh viên"
                  {...field}
                  className={cn({
                    "border-error": errors.studentId,
                  })}
                />
              )}
            />
          </div>

          {step === 2 && (
            <Fragment>
              <div className="flex flex-col gap-y-1">
                <label className="text-black/85" htmlFor="student-name">
                  Tên
                </label>

                <Controller
                  name="studentName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="student-name"
                      placeholder="Vui lòng nhập tên sinh viên"
                      className={cn({
                        "border-error": errors.studentName,
                      })}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <label className="text-black/85" htmlFor="student-class">
                  Lớp
                </label>

                <Controller
                  name="studentClass"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="student-class"
                      placeholder="Vui lòng nhập lớp sinh viên"
                      className={cn({
                        "border-error": errors.studentClass,
                      })}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <label className="text-black/85" htmlFor="student-birthday">
                  Ngày sinh
                </label>

                <Controller
                  name="studentBirthday"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="student-birthday"
                      placeholder="Chọn ngày sinh"
                      className={cn({
                        "border-error": errors.studentBirthday,
                      })}
                      {...field}
                      maxDate={dayjs(now())}
                      format="DD-MM-YYYY"
                    />
                  )}
                />
              </div>
            </Fragment>
          )}

          <Button className="w-full mt-2" type="primary" htmlType="submit">
            Check In
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default CheckInModal;
