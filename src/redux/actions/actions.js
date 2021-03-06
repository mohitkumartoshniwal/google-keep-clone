import { v4 as uuidv4 } from "uuid";
import { firebase } from "../../firebase/firebase";
import { syncFail, syncingStart, syncSuccess } from "./ui";
import { updateDatabase } from "../../utils/firebaseToState.js";
import { ADD, ADD_LIST, ADD_NEW_LABEL, DELETE, DELETE_LABEL_COMPLETELY, DELETE_PERMANENTLY, EDIT, EDIT_LABEL, EMPTY_TRASH, RESTORE } from "../constants/notesConstants";

export const addNoteSync = (note) => ({
  type: ADD,
  note: { ...note, id: uuidv4(), type: "note" },
});

export const addNote = (note) => {
  return (dispatch, getState) => {
    dispatch(addNoteSync(note));
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

export const deleteNoteSync = (id) => ({ type: DELETE, id: id });

export const deleteNote = (id) => {
  return (dispatch, getState) => {
    dispatch(deleteNoteSync(id));
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

export const deleteNotePermanentlySync = (id) => ({
  type: DELETE_PERMANENTLY,
  id: id,
});

export const deleteNotePermanently = (id) => {
  return (dispatch, getState) => {
    dispatch(deleteNotePermanentlySync(id));
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

export const editNoteSync = (id, note) => ({
  type: EDIT,
  note: note,
  id: id,
});

export const editNote = (id, note) => {
  return (dispatch, getState) => {
    dispatch(editNoteSync(id, note));
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

export const restoreNoteSync = (id) => ({ type: RESTORE, id: id });

export const restoreNote = (id) => {
  return (dispatch, getState) => {
    dispatch(restoreNoteSync(id));
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

export const emptyTrashSync = () => ({ type: EMPTY_TRASH });

export const emptyTrash = () => {
  return (dispatch, getState) => {
    dispatch(emptyTrashSync());
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

export const addNewLabelSync = (label) => ({
  type: ADD_NEW_LABEL,
  label: label,
});

export const addNewLabel = (label) => {
  return (dispatch, getState) => {
    dispatch(addNewLabelSync(label));
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

//Deletes a label completely, from all notes, all trash notes, and from labels list
export const deleteLabelCompletelySync = (label) => ({
  type: DELETE_LABEL_COMPLETELY,
  label: label,
});

export const deleteLabelCompletely = (label) => {
  return (dispatch, getState) => {
    dispatch(deleteLabelCompletelySync(label));
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

export const editLabelSync = (oldLabel, newLabel) => ({
  type: EDIT_LABEL,
  oldLabel: oldLabel,
  newLabel: newLabel,
});

export const editLabel = (oldLabel, newLabel) => {
  return (dispatch, getState) => {
    dispatch(editLabelSync(oldLabel, newLabel));
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

// export const listItemCheckedToggle = (noteId, listItem, checked) => ({type: "LIST_ITEM_CHECKED_TOGGLE", noteId: noteId, listItem: listItem, checked: checked});

export const addListSync = (list) => ({
  type: ADD_LIST,
  list: { ...list, id: uuidv4() },
});

export const addList = (list) => {
  return (dispatch, getState) => {
    dispatch(addListSync(list));
    updateDatabase(
      dispatch,
      getState,
      syncingStart,
      syncSuccess,
      syncFail,
      firebase
    );
  };
};

export const setMainState = (state) => ({ type: "SET_MAIN_STATE", state });

//Enden up not using, keep for reference
// export const startInitNotes = () => {
//   return (dispatch) => {
//     axios.get("/state.json").then((response) => {
//       const state = createState(response.data);
//       dispatch(setMainState(state));
//     });
//   };
// };
