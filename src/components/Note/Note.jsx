import React, { useState } from "react";
import { connect } from "react-redux";
import classes from "./Note.module.css";
import DeleteIcon from "@material-ui/icons/Delete";
import TooltipButton from "../TooltipButton/TooltipButton";
import { Link } from "react-router-dom";
import ListItem from "../ListItem/ListItem";
import ColorPopper from "../ColorPopper/ColorPopper";
import { editNote, } from "../../redux/actions/actions";
import Tooltip from "@material-ui/core/Tooltip";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {
    Label,
    Palette,
    Edit,
    RestoreFromTrash,
    DeleteForever
} from '@material-ui/icons';
import AddLabels from "../MainArea/AddLabels/AddLabels";
import { Box } from "@material-ui/core";

function color(color) {
    switch (color) {
        case "white":
            return classes.white;

        case "orange":
            return classes.orange;

        case "yellow":
            return classes.yellow;

        case "green":
            return classes.green;

        case "turquoise":
            return classes.turquoise;

        case "blue":
            return classes.blue;

        case "darkblue":
            return classes.darkblue;

        case "purple":
            return classes.purple;

        case "pink":
            return classes.pink;

        default:
            return;
    }
}
function Note(props) {
    const [colorPopperLocation, setColorPopperLocation] = useState(null);

    const open = Boolean(colorPopperLocation);
    const id = open ? "simple-popper" : undefined;

    const [labelPopperLocation, setLabelPopperLocation] = useState(null);

    const labelOpen = Boolean(labelPopperLocation);
    const labelId = labelOpen ? "simple-popper" : undefined;


    function addNewChosenLabelHandler(label) {
        if (label !== "" && !props.note.labels.includes(label)) {
            props.editNote(props.note.id, {
                ...props.note,
                labels: [label, ...props.note.labels]
            })
        }
    }

    function toggleLabelClickHandler(label, checked) {
        if (checked) {
            props.editNote(props.note.id, {
                ...props.note,
                labels: props.note.labels.filter(labelItem => {
                    return label !== labelItem
                })
            })
        } else {
            props.editNote(props.note.id, {
                ...props.note,
                labels: [label, ...props.note.labels]
            })
        }
    }
    function closeLabelEditHandler() {
        if (labelOpen) {
            setLabelPopperLocation(null);
        }
    }
    function openLabelEditHandler(event) {
        event.stopPropagation();
        setLabelPopperLocation((oldLabelPopperLocation) => {
            return oldLabelPopperLocation ? null : event.currentTarget;
            // event.currentTarget
        });
        setColorPopperLocation(null);
    }

    function openColorEditHandler(event) {
        event.stopPropagation();
        setColorPopperLocation((oldColorPopperLocation) => {
            return oldColorPopperLocation ? null : event.currentTarget;
        });
        setLabelPopperLocation(null);
    }

    function closeColorEditHandler() {
        if (open) {
            setColorPopperLocation(null);
        }
    }

    const colorClass = color(props.note.color);
    function removeLabelFromNote(label) {
        const newLabels = props.note.labels.filter(noteLabel => {
            return noteLabel !== label;
        })
        props.editNote(props.note.id, { ...props.note, labels: newLabels });
    }

    function changeColorHandler(color) {
        if (color !== props.note.color) {
            const newNote = { ...props.note, color: color };
            props.editNote(props.note.id, newNote);
        }
        closeColorEditHandler();
    }

    function pinHandler(event) {
        event.stopPropagation();
        const newNote = { ...props.note, pinned: !props.note.pinned };
        props.editNote(props.note.id, newNote);
    }

    return (
        <Box>
            <Box
                className={
                    classes.Note +
                    " " +
                    colorClass +
                    " " +
                    (props.editing && props.editedId === props.note.id
                        ? classes.Hide
                        : "")
                }
                onClick={
                    props.showEditButton ? () => props.onClick(props.note.id) : null
                }
            >
                <Box
                    style={{
                        position: "relative",
                        width: "100%",
                        display: "inline-block",
                        wordWrap: "break-word",
                    }}
                >
                    <Box
                        style={{
                            display: "inline-block",
                            wordWrap: "break-word",
                            width: "100%",
                        }}
                    >
                        <p
                            className={classes.Title}
                            // style={{ maxWidth: "80%", marginRight: "0", display: "inline-block" }}
                            style={{ maxWidth: "85%" }}
                        >
                            {props.note.title}
                        </p>

                        {props.note.type === "note" ? (
                            <Box style={{ width: "85%" }}>
                                <p>{props.note.content}</p>
                                {props.note.title === "" && props.note.content === "" ? (
                                    <p style={{ color: "gray" }}>Empty note</p>
                                ) : null}
                            </Box>
                        ) : (
                            <Box>
                                <ul>
                                    {props.note.unchecked.map((item) => {
                                        return (
                                            <ListItem
                                                editable={props.editable}
                                                key={item.id}
                                                item={item}
                                                checked={false}
                                                list={props.note}
                                            />
                                        );
                                    })}
                                </ul>
                                {(props.note.checked.length > 0 &&
                                    props.note.unchecked.length) > 0 ? (
                                    <hr />
                                ) : null}
                                <ul>
                                    {props.note.checked.map((item) => {
                                        return (
                                            <ListItem
                                                editable={props.editable}
                                                key={item.id}
                                                item={item}
                                                checked={true}
                                                list={props.note}
                                            />
                                        );
                                    })}
                                </ul>
                            </Box>
                        )}
                    </Box>
                    <Box
                        className={
                            classes.PinButton + (props.editable ? "" : " " + classes.Hide)
                        }
                    >
                        <TooltipButton
                            tooltipTitle="Pin note"
                            onClick={pinHandler}
                            disabled={props.editable ? false : true}
                        >
                            <i
                                className={
                                    "fas fa-thumbtack" +
                                    (props.note.pinned
                                        ? " " + classes.PinActive
                                        : " " + classes.PinInactive)
                                }
                            ></i>
                        </TooltipButton>
                    </Box>
                </Box>

                <Box className={classes.Labels}>
                    {props.note.labels.slice(0, 3).map((label) => {
                        return (
                            <Box key={label} className={classes.Label}>
                                <Link to={"/label/" + label}>
                                    <span className={classes.LabelText}>{label}</span>
                                </Link>

                                <Box className={classes.Button}>
                                    <TooltipButton
                                        tooltipTitle="Delete label"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            return removeLabelFromNote(label);
                                        }}
                                    >
                                        <span
                                            className="material-icons-outlined"
                                            style={{
                                                verticalAlign: "middle",
                                                display: "inline-block",
                                                fontSize: "15px",
                                            }}
                                        >
                                            close
                                        </span>
                                    </TooltipButton>
                                </Box>
                            </Box>
                        );
                    })}
                    {props.note.labels.length > 3 ? (
                        <Box className={classes.RemainingLabels}>
                            <span style={{ fontSize: "15px" }}>
                                {"+" + (props.note.labels.length - 3)}
                            </span>
                        </Box>
                    ) : null}
                </Box>
                <Box className={classes.ButtonArea}>
                    <Box style={{ width: props.editable ? "50px" : "145px" }}></Box>
                    {props.editable ? (
                        <Tooltip title="Change color">
                            <button type="button" onClick={openColorEditHandler}>
                                <Palette />
                            </button>
                        </Tooltip>
                    ) : null}
                    {props.editable ? (
                        <Tooltip title="Edit Labels">
                            <button type="button" onClick={openLabelEditHandler}>
                                <Label />
                            </button>
                        </Tooltip>
                    ) : null}
                    <TooltipButton
                        tooltipTitle={props.deleteTooltip}
                        onClick={(event) => {
                            event.stopPropagation();
                            return props.deleteNote(props.note.id);
                        }}
                    >
                        {props.showEditButton ? <DeleteIcon /> : <DeleteForever />}
                    </TooltipButton>

                    {props.showEditButton ? (
                        <TooltipButton
                            tooltipTitle="Edit"
                            onClick={() => props.onClick(props.index)}
                        >
                            <Edit />
                        </TooltipButton>
                    ) : (
                        <TooltipButton
                            tooltipTitle="Restore"
                            onClick={() => props.restoreNote(props.note.id)}
                        >
                            <RestoreFromTrash />
                        </TooltipButton>
                    )}
                </Box>
            </Box>
            <ClickAwayListener onClickAway={closeColorEditHandler} touchEvent={false}>
                <Popper
                    id={id}
                    open={open}
                    anchorEl={colorPopperLocation}
                // disablePortal
                >
                    <ColorPopper changeColorHandler={changeColorHandler} />
                </Popper>
            </ClickAwayListener>
            <ClickAwayListener onClickAway={closeLabelEditHandler} touchEvent={false}>
                <Popper
                    style={{ zIndex: "500" }}
                    id={labelId}
                    open={labelOpen}
                    anchorEl={labelPopperLocation}
                >
                    <AddLabels
                        chosenLabels={props.note.labels}
                        addNewChosenLabelHandler={addNewChosenLabelHandler}
                        clickHandler={toggleLabelClickHandler}
                        filterLabel={props.filterLabel}
                    />
                </Popper>
            </ClickAwayListener>
        </Box>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        editNote: (id, note) => dispatch(editNote(id, note)),
    };
};

export default connect(null, mapDispatchToProps)(Note);
