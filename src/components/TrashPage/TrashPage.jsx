import React from "react";
import { connect } from "react-redux";
import Masonry from "react-masonry-component";

import classes from "./TrashPage.module.css";
import getVisibleNotes from "../../redux/selectors/notes";
import { DeleteOutline } from "@material-ui/icons";
import Header from "../AppBar/Header/Header";
import SideBar from "../Drawer/SideBar/SideBar";
import Note from "../Note/Note";
import { deleteNotePermanently, emptyTrash, restoreNote } from "../../redux/actions/actions";
import { Box } from "@material-ui/core";

function TrashPage(props) {
  // useEffect(() => {
  //   console.log(props);
  // });
  const displayedTrashNotes = getVisibleNotes(
    props.trash,
    "",
    props.text,
    props.color
  );
  const noTrash =
    props.text === "" && props.color === "" ? (
      <Box className={classes.Empty}>
        <DeleteOutline
          className={classes.Icon}
        />
        {/* <span className={"material-icons " + classes.Icon}>delete_outline</span> */}
        <p className={classes.Note}>No notes in Trash</p>
      </Box>
    ) : (
      <h3 className={classes.SearchResult}>Search Results:</h3>
    );
  const yesTrash =
    props.text === "" && props.color === "" ? (
      <button
        style={{ marginTop: "110px" , display:"inline"}}
        className={classes.Button}
        onClick={props.emptyTrash}
      >
        Click here to empty trash
      </button>
    ) : (
      <h3 className={classes.SearchResult}>Search Results:</h3>
    );
  const isThereTrash = props.trash.length === 0 ? noTrash : yesTrash;

  return (
    <Box className={classes.NotePage}>
      <Header />
      <SideBar openEditLabels={props.openEditLabels} />
      <Box className={classes.Notes}>
        {isThereTrash}
        <Masonry>
          {displayedTrashNotes.map((note, index) => {
            return (
              <Note
                editable={false}
                type={note.type}
                key={note.id}
                note={note}
                index={index}
                deleteNote={props.deleteNotePermanently}
                deleteTooltip="Delete Permanently"
                showEditButton={false}
                restoreNote={props.restoreNote}
              />
            );
          })}
        </Masonry>
      </Box>
    </Box>
  );
}
const mapStateToProps = (state) => {
  return {
    trash: state.main.trash,
    notes: state.main.notes,
    text: state.filters.filterText,
    color: state.filters.filterColor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteNotePermanently: (index) => dispatch(deleteNotePermanently(index)),
    restoreNote: (index) => dispatch(restoreNote(index)),
    emptyTrash: () => dispatch(emptyTrash()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TrashPage);
