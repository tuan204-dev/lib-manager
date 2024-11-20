"use client";

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

  // const {
  //   bookData,
  //   isLoading,
  //   isValidating,
  //   mutate: refreshBookList,
  //   setParams,
  //   params,
  // } = useBookList()

  const data: ILib[] = [
    {
      id: "1",
      check_in: 1633660800,
      check_out: 1633660800,
      student: {
        student_id: "B222",
        name: "Nguyễn Văn A",
        student_class: "12A",
        birthday: 1633660800,
        id: "1",
      },
    },
  ];

  // const handleTableChange: TableProps<Book>["onChange"] = (
  //   pagination,
  //   filters,
  //   sorter,
  // ) => {
  //   setParams((prev) => ({
  //     ...prev,
  //     page: pagination.current,
  //     pageSize: pagination.pageSize,
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     order_by: sorter.field,

  //     order: Array.isArray(sorter)
  //       ? sorter[0].order === "ascend"
  //         ? "ASC"
  //         : "DESC"
  //       : sorter.order === "ascend"
  //         ? "ASC"
  //         : "DESC",
  //   }));
  // };

  // const handleSearch = (value: string) => {};

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
        } catch (e) {
          console.log(e);
          toast.error("Check out thất bại");
        }
      },
    });

  const columns: TableProps<ILib>["columns"] = [
    {
      title: "Tên sinh viên",
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
      title: "Thời gian vào",
      dataIndex: "check_in",
      key: "check_in",
      render: (date) => <span>{dayjs(date * 1000).format("HH:MM")}</span>,
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
            // onSearch={handleSearch}
            placeholder="Tìm kiếm sách"
            size="large"
            allowClear
            className="min-w-[400px]"
          />
        </div>

        <Table<ILib>
          columns={columns}
          dataSource={data ?? []}
          pagination={{
            position: ["bottomCenter"],
            // total: bookData?.total_elements ?? 0,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 50, 100],
            defaultPageSize: 20,
          }}
          scroll={{
            y: "calc(100vh - 240px)",
            x: 1000,
          }}
          sticky
          // loading={isLoading || isValidating}
          // onChange={handleTableChange}
        />
      </div>

      {contextHolder}
    </Fragment>
  );
};

export default LibLog;
