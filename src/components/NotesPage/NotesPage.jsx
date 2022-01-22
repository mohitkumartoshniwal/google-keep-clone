import React, { useRef, useState } from 'react'
import { connect } from 'react-redux';
import Header from '../AppBar/Header/Header'
import classes from "./NotesPage.module.css";
import Masonry from "react-masonry-component";
import {
    addNote,
    deleteNote,
    editNote,
} from "../../redux/actions/actions";
import SideBar from '../Drawer/SideBar/SideBar';
import CreateArea from '../MainArea/CreateArea/CreateArea';
import { Backdrop, Box } from '@material-ui/core';
import getVisibleNotes from "../../redux/selectors/notes";
import Note from '../Note/Note';
import EditArea from '../MainArea/EditArea/EditArea';
import { useLocation } from 'react-router-dom';

const NotesPage = (props) => {
    const [editedId, setEditedId] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editedNote, setEditedNote] = useState(null);
    const location = useLocation()
    const path = location.pathname;
    const filterLabel = path === "/" ? "" : path.slice(7, path.length);
    const filterText = props.text;
    const filterColor = props.color;
    const displayedNotes = getVisibleNotes(
        props.notes,
        filterLabel,
        filterText,
        filterColor
    );
    const pinnedNotes = displayedNotes.filter((note) => {
        return note.pinned;
    });
    const unpinnedNotes = displayedNotes.filter((note) => {
        return !note.pinned;
    });
    function editHandler(id) {
        setEditedId(id);
        setEditing(true);
        let editedIndex = props.notes.findIndex((note) => {
            return note.id === id;
        });
        if (editedIndex > -1) {
            setEditedNote(props.notes[editedIndex]);
        } 
    }

    function closeEditHandler() {
        setEditing(false);
        setEditedId(null);
        setEditedNote(null);
    }
    const editArea = useRef(null);

    function backdropClickHandler() {
        editArea.current();
        closeEditHandler();
    }

    const noNotes =
        path === "/notes" ? (
            <div className={classes.Empty}>
                <span className={"material-icons-outlined " + classes.Icon}>note</span>
                <p className={classes.Note}>Notes you add appear here</p>
            </div>
        ) : (
            <div className={classes.Empty}>
                <span className={"material-icons " + classes.Icon}>label_outline</span>
                <p className={classes.Note}>No notes with this label yet</p>
            </div>
        );

    return (
        <Box className={classes.NotesPage}>
            <Box>
                <Header />
                <SideBar openEditLabels={props.openEditLabels} />
                <CreateArea filterLabel={filterLabel} />
                {editing ? (
                    <EditArea
                        ref={editArea}
                        note={editedNote}
                        editNote={props.editNote}
                        // editedId={editedId}
                        closeEdit={closeEditHandler}
                    ></EditArea>
                ) : null}
                <Backdrop
                    open={editing}
                    onClick={backdropClickHandler}
                    invisible={false}
                />
                {displayedNotes.length === 0 &&
                    props.text === "" &&
                    props.color === ""
                    ? noNotes
                    : null}


                {pinnedNotes.length > 0 ? (
                    <Box className={classes.Notes}>
                        {props.text === "" && props.color === "" ? null : (
                            <h3 className={classes.SearchResult}>Search Results:</h3>
                        )}
                        <h5>PINNED</h5>
                        <Masonry>
                            {pinnedNotes.map((note) => {
                                return (
                                    <Note
                                        editable={true}
                                        type={note.type}
                                        editedId={editedId}
                                        editing={editing}
                                        key={note.id}
                                        note={note}
                                        // index={index}
                                        deleteNote={props.deleteNote}
                                        deleteTooltip="Delete Note"
                                        showEditButton={true}
                                        onClick={editHandler}
                                    />
                                );
                            })}
                        </Masonry>
                    </Box>
                ) : null}

                <Box
                    className={
                        classes.Notes +
                        (pinnedNotes.length > 0 ? " " + classes.NotesWhenPinned : "")
                    }
                >
                    {(props.text !== "" || props.color !== "") &&
                        pinnedNotes.length === 0 ? (
                        <h3 className={classes.SearchResult}>Search Results:</h3>
                    ) : null}
                    {pinnedNotes.length > 0 && unpinnedNotes.length > 0 ? (
                        <h5>OTHERS</h5>
                    ) : null}
                    <Masonry>
                        {unpinnedNotes.map((note) => {
                            return (
                                <Note
                                    editable={true}
                                    type={note.type}
                                    editedId={editedId}
                                    editing={editing}
                                    key={note.id}
                                    note={note}
                                    // index={index}
                                    deleteNote={props.deleteNote}
                                    deleteTooltip="Delete Note"
                                    showEditButton={true}
                                    onClick={editHandler}
                                />
                            );
                        })}
                    </Masonry>
                </Box>
            </Box>
        </Box>

    )
}


const mapStateToProps = (state) => {
    return {
        notes: state.main.notes,
        text: state.filters.filterText,
        color: state.filters.filterColor,
        labels: state.main.labels,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addNote: (note) => dispatch(addNote(note)),
        deleteNote: (id) => dispatch(deleteNote(id)),
        editNote: (id, note) => dispatch(editNote(id, note)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NotesPage);