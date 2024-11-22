/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useAddBookModal } from "@/components/AddBookModal";
import { useEditBookModal } from "@/components/EditBookModal";
import { BOOK_ERRORS } from "@/constants/errors";
import useBookList from "@/hooks/useBookList";
import useCategory from "@/hooks/useCategory";
import BookService from "@/services/BookService";
import { Book } from "@/types/book";
import { Button, Checkbox, Select, Table, TableProps, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import useModal from "antd/es/modal/useModal";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { IoFilterOutline } from "react-icons/io5";

interface IFilter {
  hasTitle: boolean;
  hasAuthor: boolean;
  hasCategory: boolean;
  category: string;
}

const initFilter: IFilter = {
  hasTitle: true,
  hasAuthor: true,
  hasCategory: true,
  category: "",
};

const Books = () => {
  const [modal, contextHolder] = useModal();
  const { open: openAddBook } = useAddBookModal();
  const { open: editBook } = useEditBookModal();

  const [filter, setFilter] = useState<IFilter>(initFilter);

  const {
    bookData,
    isLoading,
    mutate: refreshBookList,
    setParams,
    params,
  } = useBookList();

  const { categories } = useCategory();

  const handleTableChange: TableProps<Book>["onChange"] = (
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

  const handleSearch = (query: string) => {
    const newParams = { ...params };

    if (filter.hasTitle) {
      newParams.title = query;
    } else {
      delete newParams.title;
    }

    if (filter.hasAuthor) {
      newParams.author = query;
    } else {
      delete newParams.author;
    }

    if (filter.hasCategory) {
      newParams.category = filter.category ? filter.category : query;
    } else {
      delete newParams.category;
    }

    setParams(newParams);
  };

  const confirmDel = (id: string) =>
    modal.confirm({
      title: <span>Xoá sách</span>,
      content: "Bạn có chắc chắn muốn xoá sách này không?",
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await BookService.del(id);
          toast.success("Xoá sách thành công");
          refreshBookList();
        } catch (e) {
          //@ts-ignore
          const errorMsg = e?.response?.data?.message ?? "";

          switch (errorMsg) {
            case BOOK_ERRORS.BORROWED: {
              toast.error("Sách đã được mượn, không thể xoá");
            }
          }
        }
      },
    });

  const columns: TableProps<Book>["columns"] = [
    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
      render: (text) => <span>{text}</span>,
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      key: "category",
      render: (text) => <span>{text}</span>,
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      render: (text) => <span>{text}</span>,
      sorter: true,
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "publish_date",
      key: "publish_date",
      render: (date) => <span>{dayjs(date * 1000).format("DD-MM-YYYY")}</span>,
      sorter: true,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <span>{text}</span>,
      sorter: true,
    },
    {
      title: "Cập nhật lần cuối",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => <span>{dayjs(date * 1000).format("DD-MM-YYYY")}</span>,
      sorter: true,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (record: Book) => (
        <div className="flex gap-x-4">
          <Button onClick={() => confirmDel(record.id)}>Xoá</Button>
          <Button onClick={() => editBook(record)}>Chỉnh sửa</Button>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="flex-1 flex flex-col px-9 py-6 w-[calc(100vw-315px)]">
        <div className="mb-6 flex justify-between items-center gap-x-5 px-5">
          <div></div>
          <div className="flex gap-x-5 items-center">
            <Tooltip
              trigger={"click"}
              title={
                <div className="flex flex-col w-96 gap-y-[10px]">
                  <Checkbox
                    checked={filter.hasTitle}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        hasTitle: e.target.checked,
                      }))
                    }
                  >
                    <span className="text-[17px] text-black/80">Tên</span>
                  </Checkbox>
                  <Checkbox
                    checked={filter.hasAuthor}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        hasAuthor: e.target.checked,
                      }))
                    }
                  >
                    <span className="text-[17px] text-black/80">Tác giả</span>
                  </Checkbox>
                  <div className="flex flex-col">
                    <Checkbox
                      checked={filter.hasCategory}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          hasCategory: e.target.checked,
                        }))
                      }
                    >
                      <span className="text-[17px] text-black/80">
                        Thể loại
                      </span>
                    </Checkbox>
                    <div className="pl-6">
                      <Select
                        showSearch
                        placeholder="Vui lòng chọn thể loại"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            ?.toLowerCase()
                            ?.localeCompare(
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              (optionB?.label ?? "")?.toLowerCase(),
                            )
                        }
                        disabled={!filter.hasCategory}
                        style={{ width: "185px" }}
                        onSelect={(value) =>
                          setFilter((prev) => ({ ...prev, category: value }))
                        }
                      >
                        {[
                          {
                            label: "Tất cả",
                            value: "",
                          },
                          ...categories,
                        ].map((option, index) => (
                          <Select.Option key={index} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              }
              color="#fff"
            >
              <Button className="" size="large">
                <IoFilterOutline className="text-xl" />
              </Button>
            </Tooltip>

            <Search
              onSearch={handleSearch}
              placeholder="Tìm kiếm sách"
              size="large"
              allowClear
              className="min-w-[400px]"
            />
          </div>

          <Button onClick={openAddBook} type="primary" size="large">
            Thêm sách
          </Button>
        </div>

        <Table<Book>
          columns={columns}
          dataSource={bookData?.results ?? []}
          pagination={{
            position: ["bottomCenter"],
            total: bookData?.total_elements ?? 0,
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

export default Books;
