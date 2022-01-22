import React, { useState, useEffect, useRef } from "react";
import classes from "./EditLabels.module.css";
import { connect } from "react-redux";
import TooltipButton from "../../TooltipButton/TooltipButton";
import { Add } from "@material-ui/icons";
import { addNewLabel } from "../../../redux/actions/actions";
import EditLabel from "../EditLabel/EditLabel";
import { Box } from "@material-ui/core";


function EditLabels(props) {
  const [newLabel, setNewLabel] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus()
  }, []);

  function changeNewLabel(event) {
    setNewLabel(event.target.value);
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      props.addNewLabel(newLabel);
      setNewLabel("");
    }
  }

  function addHandler() {
    props.addNewLabel(newLabel);
    setNewLabel("");
    inputRef.current.focus()
  }


  return (
    <Box className={classes.Form}>
      <Box className={classes.InputAreaHeading}><p>Edit Labels</p></Box>
      <Box className={classes.InputArea}>
        <input
          ref={inputRef}
          onKeyPress={handleEnter}
          className={classes.Input}
          autoComplete="off"
          name="label"
          placeholder="Add label..."
          value={newLabel}
          onChange={changeNewLabel}
          maxLength="40"
        />{" "}
        <TooltipButton tooltipTitle="Create new label" onClick={addHandler}>
          <Add />
        </TooltipButton>
      </Box>
      <ul>
        {props.labels.map((label) => {
          return (
            <li key={label}>
              <Box className={classes.InputArea}>
                <EditLabel label={label} />
              </Box>
            </li>
          );
        })}
      </ul>
      <Box className={classes.CloseButton}>
        <TooltipButton tooltipTitle="Close" onClick={props.closeEditLabels}>
          Close
        </TooltipButton>
      </Box>
    </Box>
  );
}
const mapStateToProps = (state) => {
  return {
    labels: state.main.labels,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNewLabel: (label) => dispatch(addNewLabel(label)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditLabels);
