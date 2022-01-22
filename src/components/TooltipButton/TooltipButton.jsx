import React from "react";
import {Tooltip} from "@material-ui/core";

function TooltipButton(props) {
  return (
    <Tooltip title={props.tooltipTitle}>
      <button
        type="button"
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </Tooltip>
  );
}

export default TooltipButton;