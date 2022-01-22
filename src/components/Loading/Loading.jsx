import { Box } from "@material-ui/core";
import React from "react";
import classes from "./Loading.module.css";

const Loading = () => {
  return (
    <Box className={classes.Screen}>
      <Box className={classes.loader}></Box>
    </Box>
  );
};

export default Loading;
