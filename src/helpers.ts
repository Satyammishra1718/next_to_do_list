import _ from 'lodash';

export const fetchLocalStorage = (item : any) => {
    const getlocalItems = localStorage.getItem(item);
    return getlocalItems;
}

export const setLocalStorage = (key : any , value : any) => {
    localStorage.setItem(key , value);
}

export const  setDataTable = (fetchTodDos : any) => {
        const toDosParsed = JSON.parse(fetchTodDos);
        const toDosArray = toDosParsed.toDos;

        const formattedToDos = _.map(toDosArray,(todo: any, index: any) => ({
          key: index.toString(),
          to_do_list: todo,
     }));

     return formattedToDos;
}