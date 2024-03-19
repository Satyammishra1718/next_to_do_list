import { db } from "@/firebase/config";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';

import { USER_COLLECTION} from "@/constants/general.constants";
import { setLocalStorage , fetchLocalStorage} from "../helpers";

export const createData = async (data: string[], UID : any) => {
    try {
        const newUser = {
            to_Do_Data: data,
            timeStamp: serverTimestamp()
        };

        const userDocRef = doc(db, USER_COLLECTION, UID);
        await setDoc(userDocRef, newUser);

        const existingTodosJson = fetchLocalStorage("usersTodo");
        const existingTodos = existingTodosJson ? JSON.parse(existingTodosJson) : {};
        existingTodos.uid = UID;
        existingTodos.toDos = data;

        setLocalStorage("usersTodo", JSON.stringify(existingTodos))
        return newUser;
    } catch (error: any) {
        return false;
    }
}

export const updateData = async (oldContent: string, updatedContent: string,UID : any) => {
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

        const existingTodosJson = fetchLocalStorage("usersTodo");
        const existingTodos = existingTodosJson ? JSON.parse(existingTodosJson) : {};
        const arrayToDos = existingTodos.toDos;
        arrayToDos[toBeUpdatedIndex] = updatedContent;

        setLocalStorage("usersTodo", JSON.stringify({  toDos: arrayToDos }));
        return true;
    } catch (error: any) {
        return false;
    }
}

export const deleteData = async (oldContent: string, UID : any) => {
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

        const existingTodosJson = fetchLocalStorage("usersTodo");
        const existingTodos = existingTodosJson ? JSON.parse(existingTodosJson) : {};
        const arrayToDos = existingTodos.toDos;

        if (toBeDeletedIndex !== -1) {
            arrayToDos.splice(toBeDeletedIndex, 1);
        }

        setLocalStorage("usersTodo", JSON.stringify({  toDos: arrayToDos }))
        return true;
    } catch (error: any) {
        return false;
    }
}
