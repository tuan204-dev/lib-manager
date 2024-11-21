"use client";

import useTransList from "@/hooks/useTransList";
import TransService from "@/services/TransService";
import { ITrans } from "@/types/trans";
import dayRemaining from "@/utils/dayRemaining";
import { Button, Table, TableProps } from "antd";
import Search from "antd/es/input/Search";
import useModal from "antd/es/modal/useModal";
import dayjs from "dayjs";
import { Fragment } from "react";
import toast from "react-hot-toast";

const Borrow = () => {
  const [modal, contextHolder] = useModal();

  const { transData, mutate, isLoading, isValidating, setParams } =
    useTransList();

  const handleTableChange: TableProps<ITrans>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current,
      pageSize: pagination.pageSize,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      order_by: sorter.field,

      order: Array.isArray(sorter)
        ? sorter[0].order === "ascend"
          ? "ASC"
          : "DESC"
        : sorter.order === "ascend"
          ? "ASC"
          : "DESC",
    }));
  };

  const handleSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      student_id: value,
    }));
  };

  const confirmDel = ({ book, student }: ITrans) =>
    modal.confirm({
      title: <span>Trả sách</span>,
      content: "Bạn có chắc chắn muốn trả sách này?",
      okText: "Trả sách",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await TransService.returnBook({
            student_id: student?.student_id,
            book_id: book?.id,
          });
          toast.success("Trả sách thành công");
          mutate();
        } catch (e) {
          console.log(e);
          toast.error("Trả sách thất bại");
        }
      },
    });

  const columns: TableProps<ITrans>["columns"] = [
    {
      title: "Tên",
      key: "name",
      render: (record: ITrans) => <span>{record.student.name}</span>,
      sorter: true,
    },
    {
      title: "Mã sinh viên",
      key: "student_id",
      render: (record: ITrans) => <span>{record?.student?.student_id}</span>,
      sorter: true,
    },
    {
      title: "Sách",
      key: "title",
      render: (record: ITrans) => <span>{record.book.title}</span>,
      sorter: true,
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrow_date",
      key: "borrow_date",
      render: (date) => <span>{dayjs(date * 1000).format("DD-MM-YYYY")}</span>,
      sorter: true,
    },
    {
      title: "Số ngày đăng ký",
      dataIndex: "days_registered",
      key: "days_registered",
      render: (days) => <span>{`${days} ngày`}</span>,
      sorter: true,
    },
    {
      title: "Số ngày còn lại",
      key: "day_remaining",
      render: ({ borrow_date, days_registered }: ITrans) => (
        <span>{`${dayRemaining(borrow_date, days_registered)} ngày`}</span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (record: ITrans) => (
        <div className="flex gap-x-4">
          <Button onClick={() => confirmDel(record)}>Trả sách</Button>
          {/* <Button onClick={() => editBook(record)}>Chỉnh sửa</Button> */}
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="flex-1 flex flex-col px-9 py-6 w-[calc(100vw-315px)]">
        <div className="mb-6 flex justify-between items-center gap-x-5 px-5">
          <Search
            onSearch={handleSearch}
            placeholder="Nhập mã sinh viên"
            size="large"
            allowClear
            className="min-w-[400px]"
          />
        </div>

        <Table<ITrans>
          columns={columns}
          dataSource={transData?.results ?? []}
          pagination={{
            position: ["bottomCenter"],
            total: transData?.total_elements ?? 0,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 50, 100],
            defaultPageSize: 20,
          }}
          scroll={{
            y: "calc(100vh - 240px)",
            x: 1000,
          }}
          sticky
          loading={isLoading || isValidating}
          onChange={handleTableChange}
        />
      </div>

      {contextHolder}
    </Fragment>
  );
};

export default Borrow;
