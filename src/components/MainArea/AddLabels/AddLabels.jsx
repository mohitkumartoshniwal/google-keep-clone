import React, { useState, useRef, useEffect } from "react";
import classes from "./AddLabels.module.css";
import { addNewLabel } from "../../../redux/actions/actions";
import { connect } from "react-redux";
import TooltipButton from "../../TooltipButton/TooltipButton";
import { Add } from "@material-ui/icons";
import AddLabelItem from "../AddLabelItem/AddLabelItem";
import { Box } from "@material-ui/core";

function AddLabels(props) {
  const [newLabel, setNewLabel] = useState("");
  const inputRef = useRef(null);
  function changeNewLabel(event) {
    setNewLabel(event.target.value);
  }
  useEffect(() => {
    inputRef.current.focus();
  }, [])


  function handleEnter(event) {
    if (event.key === "Enter") {
      props.addNewLabel(newLabel);
      props.addNewChosenLabelHandler(newLabel);
      setNewLabel("");
      inputRef.current.focus();
    }
  }


  function addHandler() {
    props.addNewLabel(newLabel);
    props.addNewChosenLabelHandler(newLabel);
    setNewLabel("");
    inputRef.current.focus()
  }


  return (
    <Box className={classes.List}>
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
            <AddLabelItem key={label} label={label} clickHandler={props.clickHandler} filterLabel={props.filterLabel} chosenLabels={props.chosenLabels} />

          );
        })}
      </ul>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddLabels);
