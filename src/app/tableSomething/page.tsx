"use client";

import React, { useEffect, useState } from "react";
import "antd/dist/reset.css";
import { Table, Modal } from "antd";
import styles from "../../styles/App.module.scss";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { createData, updateData, deleteData } from "../../actions/user.actions";

const TableSomething = () => {
  const [editIndex, setEditIndex] = useState("-1");
  const [editValue, setEditValue] = useState("");
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newToDo, setNewToDo] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [addToDoArray, setToDoArray] = useState<any[]>([]);
  const [isDeleted, setDeleted] = useState(false);
  const [isCreated, setCreated] = useState(false);
  const [isUpdated, setUpdated] = useState(false);

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

  useEffect(() => {
    const handleStorageChange = () => {
      const fetchTodDos = localStorage.getItem("usersTodo");
      if (fetchTodDos) {
        const toDosParsed = JSON.parse(fetchTodDos);
        const toDosArray = toDosParsed.toDos;

        const formattedToDos = toDosArray.map((todo: any, index: any) => ({
          key: index.toString(),
          to_do_list: todo,
        }));

        setDataSource(formattedToDos);
      }
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [ isCreated , isUpdated , isDeleted]);

  useEffect(() => {
    fetchTodosFromLocalStorage();
  }, []);

  const fetchTodosFromLocalStorage = () => {
    const fetchTodDosLocal = localStorage.getItem("usersTodo");
    if (fetchTodDosLocal) {
      const todosFromLocalStorage = JSON.parse(fetchTodDosLocal).toDos;
      setToDoArray([...addToDoArray, ...todosFromLocalStorage]);
    }
  };

  const handleEdit = (index: string) => {
    setIsModalOpen(true);
    setInputPlaceholder("Edit your To Do");
    setIsEditing(true);
    setEditIndex(index);
    const oldValue = dataSource[parseInt(index)].to_do_list;
    setEditValue(oldValue);
  };

  const deleteToDo = async (index: string) => {
    const indexx = parseInt(index);
    const oldValue = dataSource[indexx].to_do_list;
    await deleteData(oldValue, setDeleted);
  };

  const showModal = () => {
    setNewToDo("");
    setIsModalOpen(true);
    setInputPlaceholder("Enter your To Do");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (isEditing) {
      setIsEditing(false);
      setEditValue("");
    }
  };

  const handleChange = (e: any) => {
    if (isEditing) {
      setEditValue(e.target.value);
    } else {
      setNewToDo(e.target.value);
    }
  };

  const handleToDo = async () => {
    if (isEditing) {

      const index = parseInt(editIndex);
      const oldValue = dataSource[index].to_do_list;
      const res = await updateData(oldValue, editValue , setUpdated);
      if (!res) return;
      handleCancel();

    } else {
      const newArray = [...addToDoArray, newToDo];
      setToDoArray(newArray);
      const res = await createData(newArray , setCreated);
      if (!res) return;

      setNewToDo("");
      setIsModalOpen(false);

      const fetchTodDos = localStorage.getItem("usersTodo");
      if (fetchTodDos) {
        const toDosParsed = JSON.parse(fetchTodDos);
        const toDosArray = toDosParsed.toDos;

        const formattedToDos = toDosArray.map((todo: any, index: any) => ({
          key: index.toString(),
          to_do_list: todo,
        }));

        setDataSource(formattedToDos);
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.buttonWrap}>
        <button onClick={showModal}>Add To-Do</button>
      </div>
      <Table
        rowKey="key"
        columns={columns}
        dataSource={dataSource}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 5,
          total: 10, }}
      />
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div>
          <input
            type="text"
            placeholder={inputPlaceholder}
            value={isEditing ? editValue : newToDo}
            onChange={handleChange}
            style={{
              width: "20rem",
              marginRight: "3rem",
              paddingLeft: "0.5rem",
            }}
          />
          <button className={styles.buttonStyles} onClick={handleToDo}>
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TableSomething;
