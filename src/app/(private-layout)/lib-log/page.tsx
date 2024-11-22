"use client";

import useLibList from "@/hooks/useLibList";
import LibService from "@/services/LibService";
import { ILib } from "@/types/lib";
import { Student } from "@/types/student";
import { Button, Table, TableProps } from "antd";
import Search from "antd/es/input/Search";
import useModal from "antd/es/modal/useModal";
import dayjs from "dayjs";
import { Fragment } from "react";
import toast from "react-hot-toast";

const LibLog = () => {
  const [modal, contextHolder] = useModal();

  const { libData, isLoading, setParams, mutate } = useLibList();

  const handleTableChange: TableProps<ILib>["onChange"] = (
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
      name: value,
      student_id: value,
    }));
  };

  const confirmCheckOut = (student: Student) =>
    modal.confirm({
      title: <span>Check out</span>,
      content: "Bạn có chắc chắn muốn check out sinh viên này?",
      okText: "Check out",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await LibService.checkOut(student.student_id);
          toast.success("Check out thành công");
          mutate();
        } catch (e) {
          console.log(e);
          toast.error("Check out thất bại");
        }
      },
    });

  const columns: TableProps<ILib>["columns"] = [
    {
      title: "Tên",
      key: "student_name",
      render: (record) => <span>{record.student.name}</span>,
      sorter: true,
    },
    {
      title: "Mã sinh viên",
      key: "student_id",
      render: (record) => <span>{record.student.student_id}</span>,
      sorter: true,
    },
    {
      title: "Lớp",
      key: "student_class",
      render: (record) => <span>{record.student.student_class}</span>,
      sorter: true,
    },
    {
      title: "Ngày sinh",
      key: "birthday",
      render: (record) => (
        <span>
          {dayjs(record.student.birthday * 1000).format("DD/MM/YYYY")}
        </span>
      ),
      sorter: true,
    },
    {
      title: "Thời gian vào",
      dataIndex: "checked_in",
      key: "checked_in",
      render: (date) => <span>{dayjs(date * 1000).format("HH:mm")}</span>,
      sorter: true,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (record) => (
        <div onClick={() => confirmCheckOut(record.student)}>
          <Button>Check out</Button>
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
            placeholder="Tìm kiếm sinh viên"
            size="large"
            allowClear
            className="min-w-[400px]"
          />
        </div>

        <Table<ILib>
          columns={columns}
          dataSource={libData?.results ?? []}
          pagination={{
            position: ["bottomCenter"],
            total: libData?.total_elements ?? 0,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 50, 100],
            defaultPageSize: 20,
          }}
          scroll={{
            y: "calc(100vh - 240px)",
            x: 1000,
          }}
          sticky
          loading={isLoading}
          onChange={handleTableChange}
        />
      </div>

      {contextHolder}
    </Fragment>
  );
};

export default LibLog;
