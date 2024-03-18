import { db } from "@/firebase/config";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';

import { USER_COLLECTION, UID } from "@/constants/general.constants";

export const createData = async (data: string[], setCreated: any) => {
    try {
        const newUser = {
            to_Do_Data: data,
            timeStamp: serverTimestamp()
        };

        const userDocRef = doc(db, USER_COLLECTION, UID);
        await setDoc(userDocRef, newUser);

        const existingTodosJson = localStorage.getItem("usersTodo");
        const existingTodos = existingTodosJson ? JSON.parse(existingTodosJson) : {};
        existingTodos.uid = UID;
        existingTodos.toDos = data;

        localStorage.setItem("usersTodo", JSON.stringify(existingTodos))
        setCreated((a: any) => !a);
        return newUser;
    } catch (error: any) {
        return false;
    }
}

export const updateData = async (oldContent: string, updatedContent: string, setUpdated: any) => {
    try {
        const docRef = doc(db, USER_COLLECTION, UID);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new Error('Document does not exist');
        }

        const currentList = docSnap.data()?.to_Do_Data || [];
        const toBeUpdatedIndex = currentList.findIndex((item: any) => item === oldContent)
        currentList[toBeUpdatedIndex] = updatedContent;

        await updateDoc(docRef, {
            to_Do_Data: currentList,
        });

        const existingTodosJson = localStorage.getItem("usersTodo");
        const existingTodos = existingTodosJson ? JSON.parse(existingTodosJson) : {};
        const arrayToDos = existingTodos.toDos;
        arrayToDos[toBeUpdatedIndex] = updatedContent;

        localStorage.setItem("usersTodo", JSON.stringify({ ...existingTodos, toDos: arrayToDos }));
        setUpdated((a: any) => !a);
        return true;
    } catch (error: any) {
        return false;
    }
}

export const deleteData = async (oldContent: string, setDeleted: any) => {
    try {
        const docRef = doc(db, USER_COLLECTION, UID);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new Error('Document does not exist');
        }

        const data = docSnap.data();
        const toDoList = data?.to_Do_Data || [];
        const toBeDeletedIndex = toDoList.findIndex((item: any) => item === oldContent)

        if (toBeDeletedIndex !== -1) {
            toDoList.splice(toBeDeletedIndex, 1);
            await updateDoc(docRef, { to_Do_Data: toDoList });
        }

        const existingTodosJson = localStorage.getItem("usersTodo");
        const existingTodos = existingTodosJson ? JSON.parse(existingTodosJson) : {};
        const arrayToDos = existingTodos.toDos;

        if (toBeDeletedIndex !== -1) {
            arrayToDos.splice(toBeDeletedIndex, 1);
        }

        localStorage.setItem("usersTodo", JSON.stringify({ ...existingTodos, toDos: arrayToDos }))
        setDeleted((a: any) => !a);
        return true;
    } catch (error: any) {
        return false;
    }
}
