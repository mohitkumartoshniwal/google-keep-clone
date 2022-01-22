import { Box, ClickAwayListener, Popper, TextareaAutosize } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { addList, addNewLabel, addNote } from '../../../redux/actions/actions';
import { v4 as uuid } from "uuid";
import classes from './CreateArea.module.css'
import TooltipButton from '../../TooltipButton/TooltipButton';
import { Add, AddCircle, Cancel, CheckBox, CheckBoxOutlined, Close, Label, Note, Palette } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import ColorPopper from '../../ColorPopper/ColorPopper';
import { connect } from 'react-redux';
import AddLabels from '../AddLabels/AddLabels';



function colorToClass(color) {
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

const CreateArea = (props) => {
    let initialChosenLabels = [];
    // if (props.filterLabel !== "") {
    //     initialChosenLabels = [props.filterLabel];
    // }
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPinned, setPinned] = useState(false);
    const [color, setColor] = useState("white");
    const [checkedList, setCheckedList] = useState([]);
    const [uncheckedList, setUncheckedList] = useState([]);
    const [chosenLabels, setChosenLabels] = useState(initialChosenLabels);
    const [isExpanded, setExpanded] = useState(false);
    const [isNewNote, setNewNote] = useState(false);
    const [isNewList, setNewList] = useState(false);
    const [colorPopperLocation, setColorPopperLocation] = useState(null);
    const [popperLocation, setPopperLocation] = useState(null);

    let colorOpen = Boolean(colorPopperLocation);
    let colorId = colorOpen ? "simple-popper" : undefined;

    let popperOpen = Boolean(popperLocation);
    let popperId = popperOpen ? "simple-popperrr" : undefined; 
    const textAreaRef = useRef(null);
    const newListItemRef = useRef(null);

    useEffect(() => {
        if (textAreaRef.current && isExpanded) {
            textAreaRef.current.focus();
        }
        if (newListItemRef.current && isExpanded) {
            newListItemRef.current.focus();
        }
    }, [isNewList, isExpanded]);



    function cancelExpand() {
        closeColorEditHandler();
        closePopperHandler();
        setExpanded(false);
        setNewNote(false);
        setNewList(false);
        setTitle("");
        setContent("");
        setColor("white");
        setPinned(false);
        setChosenLabels(initialChosenLabels);
    }

    function addNoteHandler() {
        if (isNewNote) {
            props.addNote({
                type: "note",
                title: title,
                content: content,
                labels: chosenLabels,
                pinned: isPinned,
                color: color,
            });
        } else if (isNewList) {
            const newUncheckedList = [...uncheckedList];
            if (content !== "") {
                newUncheckedList.push({ item: content, id: uuid() });
            }

            props.addList({
                type: "list",
                title: title,
                checked: checkedList,
                unchecked: newUncheckedList,
                labels: chosenLabels,
                pinned: isPinned,
                color: color,
            });
        }
        setCheckedList([]);
        setUncheckedList([]);
    }

    function closePopperHandler() {
        setPopperLocation(null);
        popperOpen = false;
    }

    function closeColorEditHandler() {
        setColorPopperLocation(null);
        colorOpen = false;
    }

    function handleKeyPressForTitle(event) {
        if (event.key === "Enter") {
            if (textAreaRef.current) {
                textAreaRef.current.focus();
            } else if (newListItemRef.current) {
                newListItemRef.current.focus();
            }
        }
    }

    function changeTitle(event) {
        setTitle(event.target.value);
    }

    function changeText(event) {
        setContent(event.target.value);
    }

    function togglePinnedHandler() {
        setPinned((prevPinned) => {
            return !prevPinned;
        });
    }

    function expandContentArea() {
        if (!isExpanded) {
            setNewNote(true);
            setExpanded(true);
            setNewList(false);
        }
    }

    function newListHandler() {
        setNewNote(false);
        setExpanded(true);
        setNewList(true);
    }

    function cancelNoteHandler() {
        setTitle("");
        setPinned(false);
        setContent("");
        setCheckedList([]);
        setUncheckedList([]);
        setExpanded(false);
        setNewNote(false);
        setNewList(false);
        setChosenLabels(initialChosenLabels);
        closeColorEditHandler();
        closePopperHandler();
    }

    function removeLabelFromNote(label) {
        setChosenLabels((prevChosenLabels) => {
            return prevChosenLabels.filter((chosenLabel) => {
                return label !== chosenLabel;
            });
        });
    }

    function openPopperHandler(event) {
        event.stopPropagation();
        setPopperLocation((oldPopperLocation) => {
            return oldPopperLocation ? null : event.currentTarget;
        });
        setColorPopperLocation(null);
    }

    function openColorEditHandler(event) {
        event.stopPropagation();
        setColorPopperLocation((oldColorPopperLocation) => {
            return oldColorPopperLocation ? null : event.currentTarget;
        });
        setPopperLocation(null);
    }

    function changeColorHandler(newColor) {
        if (newColor !== color) {
            setColor(newColor);
        }
        closeColorEditHandler();
    }

    function addNewChosenLabelHandler(label) {
        if (label !== "" && !chosenLabels.includes(label)) {
            setChosenLabels((prevChosenLabels) => {
                return [label, ...prevChosenLabels];
            });
        }
    }

    function toggleLabelClickHandler(label, checked) {
        if (checked) {
            setChosenLabels((prevChosenLabels) => {
                return prevChosenLabels.filter((chosenLabel) => {
                    return label !== chosenLabel;
                });
            });
        } else {
            setChosenLabels((prevChosenLabels) => {
                return [label, ...prevChosenLabels];
            });
        }
    }

    //Create Note Area
    let createNote = (
        <Box className={classes.Form + " " + colorToClass(color)}>
            {isNewNote || isNewList ? (
                <Box className={classes.Heading}>
                    <input
                        className={classes.Input2}
                        // style={{ width: "90%" }}
                        onKeyPress={handleKeyPressForTitle}
                        autoComplete="off"
                        value={title}
                        onChange={changeTitle}
                        name="title"
                        placeholder="Title"
                    />
                    <Box className={classes.PinButton}>
                        <TooltipButton tooltipTitle="Pin note" onClick={togglePinnedHandler}>
                            <i
                                className={
                                    "fas fa-thumbtack" +
                                    (isPinned
                                        ? " " + classes.PinActive
                                        : " " + classes.PinInactive)
                                }
                            ></i>
                        </TooltipButton>
                    </Box>
                </Box>
            ) : null}
            <Box
                className={classes.Content}
            >
                <TextareaAutosize
                    maxRows={16}
                    ref={textAreaRef}
                    onClick={() => {
                        expandContentArea();
                    }}
                    value={content}
                    onChange={changeText}
                    name="content"
                    placeholder="Take a note..."
                    minRows="1"
                />
                <Box
                    className={isNewNote ? classes.Hidden : null}
                >
                    <TooltipButton tooltipTitle="New List" onClick={newListHandler}>
                        <CheckBoxOutlined />
                    </TooltipButton>
                </Box>
            </Box>
            {isNewNote ? (
                <React.Fragment>
                    <Box className={classes.Labels}>
                        {chosenLabels.map((label) => {
                            return (
                                <Box key={label} className={classes.Label}>
                                    <Link to={"/label/" + label}>
                                        <Box className={classes.LabelText}>{label}</Box>
                                    </Link>
                                    <Box className={classes.Button}>
                                        <TooltipButton
                                            tooltipTitle="Delete label"
                                            onClick={() => removeLabelFromNote(label)}
                                        >
                                            <span
                                                className="material-icons-outlined"
                                            >
                                                close
                                            </span>
                                        </TooltipButton>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                    <Box className={classes.Buttons}>
                        <TooltipButton tooltipTitle="Add Labels" onClick={openPopperHandler}>
                            <Label />
                        </TooltipButton>
                        <TooltipButton tooltipTitle="Show checkboxes" onClick={newListHandler}>
                            <CheckBox />
                        </TooltipButton>
                        <TooltipButton tooltipTitle="Change Color" onClick={openColorEditHandler}>
                            <Palette />
                        </TooltipButton>
                        <TooltipButton tooltipTitle="Add Note" onClick={addNoteHandler}>
                            <AddCircle />
                        </TooltipButton>
                        <TooltipButton tooltipTitle="Cancel" onClick={cancelNoteHandler}>
                            <Cancel />
                        </TooltipButton>
                    </Box>
                    <ClickAwayListener onClickAway={closeColorEditHandler} touchEvent={false}>
                        <Popper
                            id={colorId}
                            open={colorOpen}
                            anchorEl={colorPopperLocation}
                        // disablePortal
                        >
                            <ColorPopper changeColorHandler={changeColorHandler} />
                        </Popper>
                    </ClickAwayListener>
                    <ClickAwayListener onClickAway={closePopperHandler} touchEvent={false}>
                        <Popper id={popperId} open={popperOpen} anchorEl={popperLocation}>
                            <AddLabels
                                chosenLabels={chosenLabels}
                                addNewChosenLabelHandler={addNewChosenLabelHandler}
                                clickHandler={toggleLabelClickHandler}
                                filterLabel={props.filterLabel}
                            />
                        </Popper>
                    </ClickAwayListener>
                </React.Fragment>
            ) : null}
        </Box>
    );



    function createListToggleHandler(item) {
        const index = uncheckedList.findIndex((listItem) => {
            return item.id === listItem.id;
        });
        if (index > -1) {
            setUncheckedList((prevUncheckedList) => {
                return prevUncheckedList.filter((listItem) => {
                    return listItem.id !== item.id;
                });
            });
            setCheckedList((prevCheckedList) => {
                return [item, ...prevCheckedList];
            });
        } else {
            setCheckedList((prevCheckedList) => {
                return prevCheckedList.filter((listItem) => {
                    return listItem.id !== item.id;
                });
            });
            setUncheckedList((prevUncheckedList) => {
                return [...prevUncheckedList, item];
            });
        }
    }

    function enterHandlerForListItems(event) {
        if (event.key === "Enter") {
            newListItemRef.current.focus();
        }
    }

    function changeListItem(event, index, checked) {
        if (checked) {
            setCheckedList((prevCheckedList) => {
                const newCheckedList = [...prevCheckedList];
                newCheckedList[index] = {
                    item: event.target.value,
                    id: prevCheckedList[index].id,
                };
                return newCheckedList;
            });
        } else {
            setUncheckedList((prevUncheckedList) => {
                const newUncheckedList = [...prevUncheckedList];
                newUncheckedList[index] = {
                    item: event.target.value,
                    id: prevUncheckedList[index].id,
                };
                return newUncheckedList;
            });
        }
    }

    function deleteListItem(item) {
        if (checkedList.includes(item)) {
            setCheckedList((prevCheckedList) => {
                return prevCheckedList.filter((listItem) => {
                    return listItem.id !== item.id;
                });
            });
        } else {
            setUncheckedList((prevUncheckedList) => {
                return prevUncheckedList.filter((listItem) => {
                    return listItem.id !== item.id;
                });
            });
        }
    }

    function addCheckedListItem() {
        if (content !== "") {
            setCheckedList((prevCheckedList) => {
                return [...prevCheckedList, { item: content, id: uuid() }];
            });
            setContent("");
            // textAreaRef.current.focus();
        }
        newListItemRef.current.focus();
    }

    function handleKeyPressForListItem(event) {
        if (event.key === "Enter" && content !== "") {
            setUncheckedList((prevUncheckedList) => {
                return [...prevUncheckedList, { item: content, id: uuid() }];
            });
            setContent("");
        }
        newListItemRef.current.focus();
    }

    function addNewListItem() {
        if (content !== "") {
            setUncheckedList((prevUncheckedList) => {
                return [...prevUncheckedList, { item: content, id: uuid() }];
            });
            setContent("");
        }
        newListItemRef.current.focus();
    }

    function hideCheckboxes() {
        setNewNote(true);
        setNewList(false);
        setUncheckedList([]);
        setCheckedList([]);
    }

    //Create List Area

    const createList = (
        <Box className={classes.Form + " " + colorToClass(color)}>
            <Box className={classes.Heading}>
                <input
                    type="text"
                    // style={{ width: "90%" }}
                    className={classes.Input2}
                    onKeyPress={handleKeyPressForTitle}
                    autoComplete="off"
                    value={title}
                    onChange={changeTitle}
                    name="title"
                    placeholder="Title"
                />
                <Box className={classes.PinButton}>
                    <TooltipButton tooltipTitle="Pin note" onClick={togglePinnedHandler}>
                        <i
                            className={
                                "fas fa-thumbtack" +
                                (isPinned ? " " + classes.PinActive : " " + classes.PinInactive)
                            }
                        ></i>
                    </TooltipButton>
                </Box>
            </Box>
            <Box className={classes.ListItem}>
                <Box className={classes.Checkbox1}>
                    <i className="far fa-square" onClick={addCheckedListItem}></i>
                </Box>
                <input
                    autoComplete="off"
                    className={classes.Input1}
                    ref={newListItemRef}
                    onKeyPress={handleKeyPressForListItem}
                    value={content}
                    onChange={changeText}
                    name="content"
                    placeholder="Add list item..."
                />
                <Box className={classes.Button1}>
                    <TooltipButton tooltipTitle="Add list item" onClick={addNewListItem}>
                        <Add />
                    </TooltipButton>
                </Box>
            </Box>
            {uncheckedList.map((item, index) => {
                return (
                    <Box className={classes.ListItem} key={item.id} >
                        <Box
                            className={classes.Checkbox}
                            onClick={() => createListToggleHandler(item)}
                        >
                            <i className="far fa-square"></i>
                        </Box>
                        <input
                            onKeyPress={enterHandlerForListItems}
                            autoComplete="off"
                            className={classes.Input}
                            value={item.item}
                            onChange={(event) => changeListItem(event, index, false)}
                            name="content"
                            placeholder="Empty list item..."
                            rows="1"
                        />
                        <Box className={classes.Button2}>
                            <TooltipButton
                                tooltipTitle="Delete List Item"
                                onClick={() => deleteListItem(item)}
                            >
                                <Close fontSize="small" />
                            </TooltipButton>
                        </Box>
                    </Box>
                );
            })}

            {checkedList.length > 0 ? <hr /> : null}
            {checkedList.map((item, index) => {
                return (
                    <Box className={classes.ListItem} key={item.id} >
                        <Box
                            className={classes.Checkbox}
                            onClick={() => createListToggleHandler(item)}
                        >
                            <i className="far fa-check-square"></i>
                        </Box>
                        <input
                            onKeyPress={enterHandlerForListItems}
                            autoComplete="off"
                            style={
                                item.item === "" ? null : { textDecoration: "line-through" }
                            }
                            className={classes.Input}
                            value={item.item}
                            onChange={(event) => changeListItem(event, index, true)}
                            name="content"
                            placeholder="Empty list item..."
                            rows="1"
                        />
                        <Box className={classes.Button2}>
                            <TooltipButton
                                tooltipTitle="Delete List Item"
                                onClick={() => deleteListItem(item)}
                            >
                                <Close fontSize="small" />
                            </TooltipButton>
                        </Box>
                    </Box>
                );
            })}

            <React.Fragment>
                <Box className={classes.Labels}>
                    {chosenLabels.map((label) => {
                        return (
                            <Box key={label} className={classes.Label}>
                                <Link to={"/label/" + label}>
                                    <Box className={classes.LabelText}>{label}</Box>
                                </Link>
                                <Box className={classes.Button}>
                                    <TooltipButton
                                        tooltipTitle="Delete label"
                                        onClick={() => removeLabelFromNote(label)}
                                    >
                                        <span
                                            className="material-icons-outlined"
                                        >
                                            close
                                        </span>
                                    </TooltipButton>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
                <Box className={classes.Buttons}>

                    <TooltipButton tooltipTitle="Add Labels" onClick={openPopperHandler}>
                        <Label />
                    </TooltipButton>
                    <TooltipButton tooltipTitle="Hide checkboxes" onClick={hideCheckboxes}>
                        <Note />
                    </TooltipButton>
                    <TooltipButton tooltipTitle="Change Color" onClick={openColorEditHandler}>
                        <Palette />
                    </TooltipButton>
                    <TooltipButton tooltipTitle="Add Note" onClick={addNoteHandler}>
                        <AddCircle />
                    </TooltipButton>
                    <TooltipButton tooltipTitle="Cancel" onClick={cancelNoteHandler}>
                        <Cancel />
                    </TooltipButton>
                </Box>

                <ClickAwayListener onClickAway={closeColorEditHandler} touchEvent={false}>
                    <Popper
                        id={colorId}
                        open={colorOpen}
                        anchorEl={colorPopperLocation}
                    // disablePortal
                    >
                        <ColorPopper changeColorHandler={changeColorHandler} />
                    </Popper>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={closePopperHandler} touchEvent={false}>
                    <Popper id={popperId} open={popperOpen} anchorEl={popperLocation}>
                        <AddLabels
                            chosenLabels={chosenLabels}
                            addNewChosenLabelHandler={addNewChosenLabelHandler}
                            clickHandler={toggleLabelClickHandler}
                            filterLabel={props.filterLabel}
                        />
                        {/* <ColorPopper changeColorHandler={changeColorHandler} /> */}
                    </Popper>
                </ClickAwayListener>
            </React.Fragment>
        </Box>
    );

    function onClickAwayHandler() {
        if (isNewNote) {
            if (title === "" && content === "") {
                cancelExpand();
            } else {
                addNoteHandler();
                cancelExpand();
            }
        } else {
            if (
                title === "" &&
                checkedList.length === 0 &&
                uncheckedList.length === 0 &&
                content === ""
            ) {
                cancelExpand();
            } else {
                addNoteHandler();
            }
        }
    }
    return (
        <ClickAwayListener onClickAway={onClickAwayHandler}>
            {isNewList ? createList : createNote}
        </ClickAwayListener>
    );
}
const mapStateToProps = (state) => {
    return {
        labels: state.main.labels,
        notes: state.main.notes,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        addNote: (note) => dispatch(addNote(note)),
        addNewLabel: (label) => dispatch(addNewLabel(label)),
        addList: (list) => dispatch(addList(list)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateArea);
