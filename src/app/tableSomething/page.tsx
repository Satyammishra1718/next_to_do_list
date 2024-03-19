"use client";

import React, { useEffect, useState } from "react";
import "antd/dist/reset.css";
import { Table, Modal } from "antd";
import styles from "../../styles/App.module.scss";
import { createData, updateData, deleteData } from "../../actions/user.actions";
import TableSchema from "../tableschema/tableschema";
import { fetchLocalStorage , setDataTable } from "@/helpers";

const TableSomething = () => {
  const [editIndex, setEditIndex] = useState("-1");
  const [editValue, setEditValue] = useState("");
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newToDo, setNewToDo] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [addToDoArray, setAddToDoArray] = useState<any[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [firebaseUID, setFirebaseUID] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const fetchTodDos = fetchLocalStorage("usersTodo");
      if (!fetchTodDos) return ;
        const formattedToDos = setDataTable(fetchTodDos);
        setDataSource(formattedToDos);
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

  useEffect(() => {
    const fetchFirebaseUID = async () => {
      try {
        const response = await fetch('/api/fetchuid');
        const data = await response.json();
        if (data && data.FIREBASE_UID) {
          setFirebaseUID(data.FIREBASE_UID);
        }
      } catch (error) {
        console.error('Error fetching Firebase UID:', error);
      }
    }

    fetchFirebaseUID();
  }, []);

  const fetchTodosFromLocalStorage = () => {
    const fetchTodDosLocal = fetchLocalStorage("usersTodo");
    if (!fetchTodDosLocal) return ;
      const todosFromLocalStorage = JSON.parse(fetchTodDosLocal).toDos;
      setAddToDoArray([...addToDoArray, ...todosFromLocalStorage]);
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
    const findIndex = addToDoArray.findIndex((item : any) => item === oldValue );
    if (findIndex !== -1) {
      addToDoArray.splice(findIndex, 1); 
      const newArray = [...addToDoArray];
      setAddToDoArray(newArray);
  }
    const res = await deleteData(oldValue,firebaseUID);
    if (!res) return;
    setIsDeleted(a => !a);
  };

  const showModal = () => {
    setNewToDo("");
    setIsModalOpen(true);
    setInputPlaceholder("Enter your To Do");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (!isEditing) return 
      setIsEditing(false);
      setEditValue("");
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
      const findIndex = addToDoArray.findIndex((item : any) => item === oldValue );
      addToDoArray[findIndex] = editValue;
      const res = await updateData(oldValue, editValue , firebaseUID);
      if (!res) return;
      setIsUpdated(a => !a);
      handleCancel();
    } 
    else 
      {
      const newArray = [...addToDoArray, newToDo];
      setAddToDoArray(newArray);
      const res = await createData(newArray , firebaseUID);
      if (!res) return;
      setIsCreated(a => !a);

      setNewToDo("");
      setIsModalOpen(false);

      const fetchTodDos = fetchLocalStorage("usersTodo");
      if (!fetchTodDos) return ;
        const formattedToDos = setDataTable(fetchTodDos);
        setDataSource(formattedToDos);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.buttonWrap}>
        <button onClick={showModal}>Add To-Do</button>
      </div>
      <Table
        rowKey="key"
        columns={TableSchema({handleEdit , deleteToDo})}
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
