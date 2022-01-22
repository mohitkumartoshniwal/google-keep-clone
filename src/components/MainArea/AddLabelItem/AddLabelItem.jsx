import { Box } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import classes from "./AddLabelItem.module.css";

function AddLabelItem(props) {
  const [checked, setChecked] = useState(props.label === props.filterLabel);

  useEffect (() => {
    setChecked(props.chosenLabels.includes(props.label));
  }, [props.chosenLabels, props.label]) 

  function toggleHandler() {
    props.clickHandler(props.label, checked);
    setChecked((prevChecked) => {
      return !prevChecked;
    });
  }
  return (
    <li key={props.label} onClick={toggleHandler}>
      <Box className={classes.Checkbox}>
        {checked ? (
          <i className="far fa-check-square"></i>
        ) : (
          <i className="far fa-square"></i>
        )}
      </Box>
      <Box className={classes.Label}>
        {props.label}
      </Box>
    </li>
  );
}

export default AddLabelItem;
