import React from "react";
import classes from "./ListItem.module.css";
import { connect } from "react-redux";
import { editNote } from "../../redux/actions/actions";
import { Box } from "@material-ui/core";

function ListItem(props) {
  // function toggleHandler(event) {
  //   props.listItemCheckedToggle(props.listId, props.item, props.checked);
  //   event.stopPropagation();
  // }

  function toggleHandler(event) {
    event.stopPropagation();
    let checked = [...props.list.checked];
    let unchecked = [...props.list.unchecked];
    if (props.checked) {
      checked = checked.filter((item) => {
        return item.id !== props.item.id;
      });
      unchecked = [...unchecked, { ...props.item }];
    } else {
      unchecked = unchecked.filter((item) => {
        return item.id !== props.item.id;
      });
      checked = [{ ...props.item }, ...checked];
    }
    const newNote = {
      ...props.list,
      checked: checked,
      unchecked: unchecked,
    };
    props.editNote(props.list.id, newNote);
  }
  return (
    <li>
      <Box
        className={
          props.editable
            ? classes.Editable + " " + classes.Checkbox
            : classes.NotEditable + " " + classes.Checkbox
        }
        onClick={props.editable ? toggleHandler : null}
      >
        {props.checked ? (
          <i className="far fa-check-square"></i>
        ) : (
          <i className="far fa-square"></i>
        )}
      </Box>
      <Box
        className={classes.Item}
        style={{
          textDecoration: props.checked ? "line-through" : "default",
        }}
      >
        {props.item.item}
      </Box>
    </li>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    editNote: (id, note) => dispatch(editNote(id, note)),
  };
};

export default connect(null, mapDispatchToProps)(ListItem);
