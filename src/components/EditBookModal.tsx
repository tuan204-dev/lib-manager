"use client";
import useBookList from "@/hooks/useBookList";
import useCategory from "@/hooks/useCategory";
import BookService from "@/services/BookService";
import { Book } from "@/types/book";
import cn from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@mui/material";
import { Button, DatePicker, InputNumber, Select } from "antd";
import Input from "antd/es/input/Input";
import dayjs from "dayjs";
import { floor, now } from "lodash";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaStarOfLife } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { create } from "zustand";

const schema = z.object({
  title: z.string().min(1, "Tên sách không được để trống"),
  author: z.string().min(1, "Tác giả không được để trống"),
  category: z.string().min(1, "Thể loại không được để trống"),
  publishDate: z.any().refine((val) => !!val, {
    message: "Thời gian xuất bản không được để trống",
  }),
  quantity: z.number().min(1, "Số lượng không được để trống").max(10000),
});

interface FormValues {
  title: string;
  author: string;
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishDate: any;
  quantity: number;
}

interface EditBookModalState {
  isOpen: boolean;
  book: Book | null;
  open: (book: Book) => void;
  close: () => void;
}

export const useEditBookModal = create<EditBookModalState>((set) => ({
  isOpen: false,
  book: null,
  open: (book) => set({ isOpen: true, book }),
  close: () => set({ isOpen: false, book: null }),
}));

const EditBookModal = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { mutate: refreshBookList } = useBookList();

  const { categories } = useCategory();

  const { isOpen, close, book } = useEditBookModal();

  useEffect(() => {
    if (!isOpen) {
      reset();

      return;
    }

    if (book) {
      setValue("title", book.title);
      setValue("author", book.author);
      setValue("category", book.category);
      setValue("publishDate", dayjs.unix(book.publish_date));
      setValue("quantity", book.quantity);
    }
  }, [book, isOpen, reset, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      await BookService.edit({
        id: book?.id ?? "",
        title: data.title,
        author: data.author,
        category: data.category,
        quantity: data.quantity,
        publish_date: floor(new Date(data.publishDate).getTime() / 1000),
      });

      close();

      toast.success("Sửa sách thành công");
      refreshBookList();
      reset();
    } catch (e) {
      console.log(e);
      toast.error("Sửa sách thất bại");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={close}
      className="flex items-center justify-center !z-10"
    >
      <div className="bg-white px-5 py-4 rounded-md flex flex-col w-screen max-w-[550px] outline-none">
        <div className="grid grid-cols-[50px,1fr,50px]">
          <div></div>
          <span className="text-center mx-auto text-[28px] font-bold">
            Chỉnh sửa sách
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
          className="grid grid-cols-2 gap-x-4 gap-y-4 mt-5"
        >
          <div className="flex flex-col gap-y-1">
            <label htmlFor="title" className="text-black/85 flex items-center">
              Tên sách{" "}
              <FaStarOfLife className="text-red-500 text-[10px] ml-1" />
            </label>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="Vui lòng nhập tên sách"
                  className={cn({
                    "border-error": errors.title,
                  })}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="author" className="text-black/85 flex items-center">
              Tác giả <FaStarOfLife className="text-red-500 text-[10px] ml-1" />
            </label>

            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="author"
                  placeholder="Vui lòng nhập tên tác giả"
                  className={cn({
                    "border-error": errors.author,
                  })}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label
              htmlFor="category"
              className="text-black/85 flex items-center"
            >
              Thể loại{" "}
              <FaStarOfLife className="text-red-500 text-[10px] ml-1" />
            </label>

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  showSearch
                  placeholder="Vui lòng chọn thể loại"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={categories}
                  id="category"
                  {...field}
                  className={cn({
                    "select-error": errors.category,
                  })}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label
              htmlFor="publish-date"
              className="text-black/85 flex items-center"
            >
              Thời gian xuất bản{" "}
              <FaStarOfLife className="text-red-500 text-[10px] ml-1" />
            </label>

            <Controller
              name="publishDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  id="publish-date"
                  className={cn({
                    "border-error": errors.publishDate,
                  })}
                  placeholder="Vui lòng chọn thời gian xuất bản"
                  maxDate={dayjs(now())}
                  format="DD-MM-YYYY"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-y-1 col-span-full">
            <label
              htmlFor="quantity"
              className="text-black/85 flex items-center"
            >
              Số lượng{" "}
              <FaStarOfLife className="text-red-500 text-[10px] ml-1" />
            </label>

            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={1}
                  max={10000}
                  id="quantity"
                  className={cn("w-full", {
                    "border-error": errors.quantity,
                  })}
                  placeholder="Vui lòng nhập số lượng"
                />
              )}
            />
          </div>

          <Button htmlType="submit" type="primary" className="col-span-full">
            Lưu
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default EditBookModal;
