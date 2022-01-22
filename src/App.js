import "./App.css";
import React, { useState } from "react";
import { Router, Route, Routes, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import NotesPage from "./components/NotesPage/NotesPage";
import TrashPage from "./components/TrashPage/TrashPage";
import LoginPage from "./components/LoginPage/LoginPage";
import { connect } from "react-redux";
import Loading from "./components/Loading/Loading";
import { ThemeProvider, CssBaseline, Backdrop } from "@material-ui/core";
import { dark, light } from "./theme";
import EditLabels from "./components/MainArea/EditLabels/EditLabels";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";

export const history = createBrowserHistory();

function App(props) {
  const [editingLabels, setEditingLabels] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  function openEditLabels() {
    setEditingLabels(true);
  }

  function closeEditLabels() {
    setEditingLabels(false);
  }

  const routes = (
    <Switch>
      <Route path="/" exact render={(props) => <LoginPage />} />
      <Route
        path="/notes"
        exact
        render={(props) => (
          <NotesPage {...props} openEditLabels={openEditLabels} />
        )}
      />
     
      <Route
        path="/trash"
        exact
        render={(props) => (
          <TrashPage {...props} openEditLabels={openEditLabels} />
        )}
      />

      {props.labels.map((label) => {
        return (
          <Route
            key={label}
            path={"/label/" + label}
            exact
            render={(props) => (
              <NotesPage {...props} openEditLabels={openEditLabels} />
            )}
          />
        );
      })}
      <Route component={NotFoundPage} />
    </Switch>
  );
  return (
    <ThemeProvider theme={isDarkMode ? dark : light}>
      <CssBaseline />
      <Router history={history}>
      {props.loggingIn ? (
        <Loading />
      ) : (
        <React.Fragment>
          {editingLabels ? (
            <EditLabels closeEditLabels={closeEditLabels} />
          ) : null}
          <Backdrop
            open={editingLabels}
            onClick={closeEditLabels}
            invisible={false}
          />
          {routes}
        </React.Fragment>
      )}
    </Router>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => {
  return {
    labels: state.main.labels,
    loggingIn: state.auth.loggingIn,
  };
};

export default connect(mapStateToProps)(App);
