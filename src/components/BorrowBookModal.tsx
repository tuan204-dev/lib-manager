/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { BORROW_ERRORS } from "@/constants/errors";
import useBookListSearch from "@/hooks/useBookListSearch";
import StudentService from "@/services/StudentService";
import TransService from "@/services/TransService";
import { ModalState } from "@/types/common";
import cn from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@mui/material";
import {
  AutoComplete,
  AutoCompleteProps,
  Button,
  DatePicker,
  Input,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { debounce, floor, now } from "lodash";
import { Fragment, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { create } from "zustand";

export const useBorrowBookModal = create<ModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

interface FormValues {
  studentId: string;
  studentName: string;
  studentClass: string;
  studentBirthday: string;
  bookId: string;
  dayRegistered: number;
}

const BorrowBookModal = () => {
  const [step, setStep] = useState(1);
  const { close, isOpen } = useBorrowBookModal();

  const { bookData, setParams } = useBookListSearch();

  const schema = useMemo(() => {
    if (step === 1) {
      return z.object({
        studentId: z.string().min(1, "Mã sinh viên không được để trống"),
        bookId: z.string().min(1, "Mã sách không được để trống"),
        dayRegistered: z.number().min(1, "Số ngày mượn không được để trống"),
      });
    }

    return z.object({
      studentId: z.string().min(1, "Mã sinh viên không được để trống"),
      studentName: z.string().min(1, "Tên sinh viên không được để trống"),
      studentClass: z.string().min(1, "Lớp sinh viên không được để trống"),
      studentBirthday: z
        .any()
        .refine((val) => !!val, { message: "Ngày sinh không được để trống" }),
      bookId: z.string().min(1, "Mã sách không được để trống"),
      dayRegistered: z.number().min(1, "Số ngày mượn không được để trống"),
    });
  }, [step]);

  const {
    control,
    formState: { errors },
    setValue,
    reset,
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const bookIdRef = useRef<any>();

  const bookOptions = useMemo<AutoCompleteProps["options"]>(
    () =>
      bookData?.results?.map((i) => ({
        value: i.title,
        label: i.title,
        title: i.id,
      })),
    [bookData],
  );

  const handleSearchBook = debounce((text) => {
    setParams((prev) => ({ ...prev, title: text }));
  }, 300);

  const handleClose = () => {
    close();
    setStep(1);
    reset();
    bookIdRef.current?.clearInput?.();
  };

  const onSubmit = async (data: FormValues) => {
    const {
      bookId,
      dayRegistered,
      studentBirthday,
      studentClass,
      studentId,
      studentName,
    } = data;

    try {
      if (step === 1) {
        const student = await StudentService.getInfo(studentId);

        if (!student) {
          toast.error(
            "Không tìm thấy sinh viên trong hệ thống. Vui lòng nhập thông tin sinh viên",
          );
          setStep(2);
        } else {
          await TransService.borrow({
            book_id: bookId,
            days_registered: dayRegistered,
            student_id: studentId,
          });
          toast.success("Mượn sách thành công");
          handleClose();
        }
      } else {
        await StudentService.add({
          student_id: studentId,
          birthday: floor(new Date(studentBirthday).getTime() / 1000),
          name: studentName,
          student_class: studentClass,
        });

        await TransService.borrow({
          book_id: bookId,
          days_registered: dayRegistered,
          student_id: studentId,
        });
        toast.success("Mượn sách thành công");
        handleClose();
      }
    } catch (e) {
      //@ts-ignore
      const errorMsg = e?.response?.data?.message ?? "";

      switch (errorMsg) {
        case BORROW_ERRORS.BORROWED: {
          toast.error("Sinh viên này đã mượn cuốn này rồi");
        }
      }
      handleClose();
    }
  };

  return (
    <Modal
      onClose={close}
      open={isOpen}
      className="flex items-center justify-center !z-10"
    >
      <div className="bg-white px-5 py-4 rounded-md flex flex-col w-screen max-w-[550px] outline-none">
        <div className="grid grid-cols-[50px,1fr,50px]">
          <div></div>
          <span className="text-center mx-auto text-[28px] font-bold">
            Mượn sách
          </span>
          <button
            onClick={close}
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

          <div className="flex flex-col gap-y-1">
            <label htmlFor="category" className="text-black/85">
              Tên sách
            </label>

            <AutoComplete
              options={bookOptions}
              onSelect={(_, { title }) => setValue("bookId", title ?? "")}
              placeholder="Vui lòng nhập tên sách"
              onChange={handleSearchBook}
              ref={bookIdRef}
              allowClear
              className={cn("w-full", {
                "select-error": errors.bookId,
              })}
            />
          </div>

          <div className="flex flex-col gap-y-1 col-span-full">
            <label htmlFor="quantity" className="text-black/85">
              Thời gian mượn (ngày)
            </label>

            <Controller
              name="dayRegistered"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={1}
                  max={30}
                  id="quantity"
                  className={cn("w-full", {
                    "border-error": errors.dayRegistered,
                  })}
                  placeholder="Vui lòng nhập số ngày mượn sách"
                />
              )}
            />
          </div>

          <Button className="w-full mt-2" type="primary" htmlType="submit">
            Mượn sách
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default BorrowBookModal;
