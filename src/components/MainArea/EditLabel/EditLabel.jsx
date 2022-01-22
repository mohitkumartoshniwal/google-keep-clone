import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import classes from "./EditLabel.module.css";
import {  useLocation } from "react-router-dom";
import TooltipButton from "../../TooltipButton/TooltipButton";
import { DeleteForever, Edit } from "@material-ui/icons";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText } from "@material-ui/core";
import { deleteLabelCompletely, editLabel } from "../../../redux/actions/actions";
import { useHistory } from "react-router-dom";

function EditLabel(props) {
  const [labelName, setLabelName] = useState(props.label);
  const [dialogOpen, setDialogOpen] = useState(false);
  const inputRef = useRef(null);

  const location = useLocation();
  const history = useHistory();
  function changeLabelName(event) {
    setLabelName(event.target.value);
  }
  function handleDialogkOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function editHandler() {
    if (!props.labels.includes(labelName)) {
      props.editLabel(props.label, labelName);
      if ("/label/" + props.label === location.pathname) {
        history.push("/label/" + labelName);
      }
    } else {
      setLabelName(props.label);
      inputRef.current.focus();
    }
  }

  function deleteHandler() {
    if ("/label/" + props.label === location.pathname) {
      history.push("/notes");
    }
    props.deleteLabelCompletely(props.label);
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      if (!props.labels.includes(labelName)) {
        props.editLabel(props.label, labelName);
        if ("/label/" + props.label === location.pathname) {
          history.push("/label/" + labelName);
        }
        inputRef.current.blur();
      } else {
        setLabelName(props.label);
      }
    }
  }

  // useEffect(() => {
  //   const index = props.labels.indexOf(props.label);
  //   setLabelName(props.labels[index]);
  // }, [props.labels, props.label]);

  return (
    <Box className={classes.InputArea}>
      <TooltipButton tooltipTitle="Delete this label" onClick={handleDialogkOpen}>
        <DeleteForever />
      </TooltipButton>
      <input
        ref={inputRef}
        type="text"
        className={classes.Input}
        onKeyPress={handleEnter}
        value={labelName}
        onChange={changeLabelName}
        name="label name"
        placeholder="Edit label name..."
      />
      <TooltipButton tooltipTitle="Edit" onClick={editHandler}>
        <Edit />
      </TooltipButton>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
      >
        <DialogContent>
          <DialogContentText>
            We’ll delete this label and remove it from all of your notes. Your
            notes won’t be deleted
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box className={classes.Button}>
            <TooltipButton onClick={handleDialogClose} tooltipTitle="Cancel">
              Cancel
            </TooltipButton>
          </Box>
          <Box className={classes.Button}>
            <TooltipButton onClick={deleteHandler} tooltipTitle="Delete">
              Delete
            </TooltipButton>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
const mapStateToProps = (state) => {
  return {
    labels: state.main.labels,
    filterLabel: state.filters.filterLabel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editLabel: (oldLabel, newLabel) => dispatch(editLabel(oldLabel, newLabel)),
    deleteLabelCompletely: (label) => dispatch(deleteLabelCompletely(label)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditLabel);
