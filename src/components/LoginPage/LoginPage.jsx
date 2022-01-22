import React from "react";
import classes from "./LoginPage.module.css";
import { connect } from "react-redux";
import { startLogin } from "../../redux/actions/auth";
import { Box } from "@material-ui/core";

const LoginPage = (props) => {
  return (
    <Box className={classes.Screen}>
      <Box className={classes.Form}>
        <h1>
          <i className="far fa-lightbulb"></i> <span>Keeper</span>
        </h1>

        <Box>
          <p>Keep your notes organized.</p>
        </Box>
        <Box className={classes.ButtonArea}>
          <button onClick={props.startLogin}>Login with Google</button>
          {/* <button>Guest Mode</button> */}
        </Box>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  startLogin: () => dispatch(startLogin()),
});
export default connect(undefined, mapDispatchToProps)(LoginPage);
