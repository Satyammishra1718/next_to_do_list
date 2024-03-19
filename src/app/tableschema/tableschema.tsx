import React from 'react';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const TableSchema = ({ handleEdit, deleteToDo }: any) => {
  const columns = [
    {
      title: "To Do List",
      dataIndex: "to_do_list",
      key: "key",
      width: "70vh",
      render: (text: any) => {
        return text;
      },
    },
    {
      title: "Update",
      dataIndex: "key",
      key: "key",
      render: (index: any) => (
        <EditOutlined
          style={{ cursor: "pointer" }}
          onClick={() => handleEdit(index)}
        />
      ),
    },
    {
      title: "Delete",
      dataIndex: "key",
      key: "key",
      render: (index: any) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() => deleteToDo(index)}
        />
      ),
    },
  ];

  return columns;
};

export default TableSchema;
