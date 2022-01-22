import React from "react";
import classes from "./EditLabelsNavItem.module.css";

function EditLabelsNavItem(props) {
  return (
    <li className={classes.NavigationItem} onClick={props.openEditLabels}>
      <div>
        <span
          className="material-icons-outlined"
        >
          edit
        </span>{" "}
        <span className={classes.Title} >Edit Labels</span>
      </div>
    </li>
  );
}

export default EditLabelsNavItem;