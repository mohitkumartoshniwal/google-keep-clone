import React from "react";
import classes from "./ColorPopper.module.css";
import Tooltip from "@material-ui/core/Tooltip";
import { Box } from "@material-ui/core";

const COLORS = [
  "white",
  "orange",
  "yellow",
  "green",
  "turquoise",
  "blue",
  "darkblue",
  "purple",
  "pink",
];

function ColorPopper(props) {
  return (
    <Box className={classes.Frame}>
      <Box>
        {COLORS.map((color, index) => {
          return (
            <Tooltip key={color} title={color}>
             
              <Box className={classes.Button + " " +color} onClick={() => props.changeColorHandler(color)}></Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}

export default ColorPopper;
