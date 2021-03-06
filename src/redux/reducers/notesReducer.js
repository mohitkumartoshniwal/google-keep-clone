
import { ADD, ADD_LIST, ADD_NEW_LABEL, DELETE, DELETE_LABEL_COMPLETELY, DELETE_PERMANENTLY, EDIT, EDIT_LABEL, EMPTY_TRASH, RESTORE, SET_MAIN_STATE } from "../constants/notesConstants";

const initialState = {
  notes: [],
  labels: [],
  trash: [],
};

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MAIN_STATE:
      return action.state;
    case ADD:
      return {
        ...state,
        notes: [action.note, ...state.notes],
      };
    case EDIT:
      const editedNotes = [...state.notes];
      let editIndex = state.notes.findIndex((note) => note.id === action.id);
      if (editIndex > -1) {
        editedNotes[editIndex] = action.note;
      }
      return {
        ...state,
        notes: editedNotes,
      };

    case DELETE:
      const deleteIndex = state.notes.findIndex(
        (note) => note.id === action.id
      );
      let deletedNotes = [...state.notes];
      let deletedTrash = [...state.trash];
      if (deleteIndex > -1) {
        deletedNotes = state.notes.filter((note) => {
          return note.id !== action.id;
        });
        const pinRemovedNote = { ...state.notes[deleteIndex], pinned: false };
        deletedTrash = [pinRemovedNote, ...state.trash];
      } 

      return {
        ...state,
        notes: deletedNotes,
        trash: deletedTrash,
      };

    case RESTORE:
      const restoreIndex = state.trash.findIndex(
        (note) => note.id === action.id
      );
      const restoredTrash = state.trash.filter((_, index) => {
        return index !== restoreIndex;
      });
      return {
        ...state,
        notes: [...state.notes, state.trash[restoreIndex]],
        trash: restoredTrash,
      };

    case DELETE_PERMANENTLY:
      const permDeleteIndex = state.trash.findIndex(
        (note) => note.id === action.id
      );
      const newTrash = state.trash.filter((_, index) => {
        return index !== permDeleteIndex;
      });
      return {
        ...state,
        trash: newTrash,
      };
      
    case EMPTY_TRASH:
      return {
        ...state,
        trash: [],
      };


    case ADD_NEW_LABEL:
      const newLabels =
        state.labels.includes(action.label) || action.label === ""
          ? [...state.labels]
          : [action.label, ...state.labels];
      return {
        ...state,
        labels: newLabels,
      };

    case EDIT_LABEL:
      if (!action.newLabel) {
        return state;
      }
      const editLabelIndex = state.labels.indexOf(action.oldLabel);
      const editedLabels = [...state.labels];
      editedLabels[editLabelIndex] = action.newLabel;

      const editedLabelNotes = state.notes.map((note) => {
        const newLabelsOfNote = note.labels.map((label) => {
          if (label === action.oldLabel) {
            return action.newLabel;
          } else {
            return label;
          }
        });
        return { ...note, labels: newLabelsOfNote };
      });

      const editedLabelTrash = state.trash.map((note) => {
        const newLabelsOfTrashNote = note.labels.map((label) => {
          if (label === action.oldLabel) {
            return action.newLabel;
          } else {
            return label;
          }
        });
        return { ...note, labels: newLabelsOfTrashNote };
      });


      return {
        labels: editedLabels,
        notes: editedLabelNotes,
        trash: editedLabelTrash,
      };

    case DELETE_LABEL_COMPLETELY:
      const deletedLabels = state.labels.filter((label) => {
        return label !== action.label;
      });

      const deletedLabelNotes = state.notes.map((note) => {
        const deletedLabelsOfNote = note.labels.filter((label) => {
          return label !== action.label;
        });
        return { ...note, labels: deletedLabelsOfNote };
      });

      const deletedLabelTrash = state.trash.map((note) => {
        const deletedLabelsOfTrash = note.labels.filter((label) => {
          return label !== action.label;
        });
        return { ...note, labels: deletedLabelsOfTrash };
      });

      return {
        labels: deletedLabels,
        notes: deletedLabelNotes,
        trash: deletedLabelTrash,
      };

    case ADD_LIST:
      return {
        ...state,
        notes: [action.list, ...state.notes],
      };
    
    default:
      return state;
  }
};

export default notesReducer;
