import { Box, ClickAwayListener } from '@material-ui/core';
import React from 'react'
import { connect } from 'react-redux';
import { closeSidebar } from '../../../redux/actions/ui';
import EditLabelsNavItem from '../EditLabelsNavItem/EditLabelsNavItem';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from "./SideBar.module.css";


const SideBar = (props) => {
    function clickAwayHandler() {
        if (props.sidebarOpen) {
          props.closeSidebar();
        }
      }
    return (
        <ClickAwayListener onClickAway={clickAwayHandler} touchEvent={false}>
        <Box
          className={
            classes.SideBar +
            " " +
            (props.sidebarOpen ? classes.Open : classes.Close)
          }
        >
          <nav>
            <ul className={classes.NavigationItems}>
              <NavigationItem path="/notes" iconName="note" title="Notes" />
  
              {props.labels.map((label) => {
                return (
                  <NavigationItem
                    key={label}
                    path={"/label/" + label}
                    iconName="label"
                    title={label}
                  />
                );
              })}
              <EditLabelsNavItem openEditLabels={props.openEditLabels} />

           
              <NavigationItem path="/trash" iconName="delete" title="Trash" />
            </ul>
          </nav>
        </Box>
      </ClickAwayListener>
    )
}

const mapStateToProps = (state) => {
    return {
      labels: state.main.labels,
      sidebarOpen: state.ui.sidebarOpenMobile,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      closeSidebar: () => dispatch(closeSidebar()),
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(SideBar);