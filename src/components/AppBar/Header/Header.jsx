import { Box, ClickAwayListener, Popper, Tooltip } from '@material-ui/core';
import { Clear, CloudDoneOutlined, Menu, PaletteOutlined, Refresh, Search } from '@material-ui/icons';
import classes from "./Header.module.css";
import React, { useRef, useState } from 'react'
import { connect } from 'react-redux';
import { startLogout } from '../../../redux/actions/auth';
import { setFilterText, setFilterColor } from "../../../redux/actions/filters";
import { openSidebar, closeSidebar, syncingStart, syncSuccess, syncFail } from "../../../redux/actions/ui";
import { Link } from 'react-router-dom';
import TooltipButton from '../../TooltipButton/TooltipButton';
import ColorPopper from '../../ColorPopper/ColorPopper';
import { firebase } from "../../../firebase/firebase";


const Header = (props) => {
    const [colorPopperLocation, setColorPopperLocation] = useState(null);

    const open = Boolean(colorPopperLocation); 
    const id = open ? "simple-popper" : undefined; 
    const menu = useRef(null); 
    function openColorEditHandler(event) {
        event.stopPropagation();
        setColorPopperLocation((oldColorPopperLocation) => {
            return oldColorPopperLocation ? null : event.currentTarget;
        });
    }
    function closeColorEditHandler(event) {
        if (open) {
            console.log(event);
            setColorPopperLocation(null);
        }
    }
    function setfilterText(event) {
        props.setFilterText(event.target.value);
    }

    function setFilterColor(color) {
        props.setFilterColor(color);
        closeColorEditHandler();
    }
    function clearSearch() {
        props.setFilterText("");
        props.setFilterColor("");
    }


    function toggleSidebar(event) {
        if (props.sidebarOpen) {
            props.closeSidebar();
        } else {
            event.stopPropagation();
            props.openSidebar();
        }
    }

    function refreshSyncHandler() {
        const route = "/users/" + props.uid;
        props.syncingStart();
        firebase
            .database()
            .ref(route)
            .set(props.main)
            .then(() => {
                console.log("success");
                props.syncSuccess();
            })
            .catch(() => {
                props.syncFail();
            });
    }

    let syncButton = (
        <Tooltip title="synced">
            <button className={classes.Cloud}>
                <CloudDoneOutlined />
            </button>
        </Tooltip>
    );

    if (props.syncStatus === "syncing") {
        syncButton = (
            <Tooltip title="syncing">
                <button className={classes.Cloud}>
                    <Box className={classes.Loader}></Box>
                </button>
            </Tooltip>
        );
    } else if (props.syncStatus === "failed") {
        syncButton = (
            <Tooltip title="Failed to sync. Click here to try again.">
                <button
                    className={classes.Cloud + " " + classes.Retry}
                    onClick={refreshSyncHandler}
                >
                    <Refresh />
                </button>
            </Tooltip>
        );
    }



    return (
        <header className={classes.header}>
            <span
                className={classes.HamburgerMenu}
                onClick={toggleSidebar}
                ref={menu}
            >
                <Menu fontSize="inherit" />
            </span>
            <span className={classes.Keep}>
                <Link to="/notes" exact="true" onClick={clearSearch}>
                    <h1>
                        <i className="far fa-lightbulb"></i> <span>Keep</span>
                    </h1>
                </Link>
            </span>
            <Box className={classes.Search}>
                <Box className={classes.SearchButton}>
                    <TooltipButton tooltipTitle="Search">
                        <Search />
                    </TooltipButton>
                </Box>
                <input
                    type="text"
                    placeholder={
                        "Search" + (props.color === "" ? "" : " within " + props.color)
                    }
                    value={props.text}
                    onChange={setfilterText}
                ></input>
                <Box className={classes.RightButtons}>
                    <Box
                        className={
                            classes.PaletteButton +
                            " " +
                            props.color
                        }
                    >
                        <TooltipButton
                            tooltipTitle="Filter by color"
                            onClick={openColorEditHandler}
                        >
                            <PaletteOutlined />
                        </TooltipButton>
                    </Box>
                    <ClickAwayListener
                        onClickAway={closeColorEditHandler}
                        touchEvent={false}
                    >
                        <Popper
                            id={id}
                            open={open}
                            anchorEl={colorPopperLocation}
                            disablePortal
                        >
                            <ColorPopper changeColorHandler={setFilterColor} />
                        </Popper>
                    </ClickAwayListener>
                    <Box className={classes.ClearButton}>
                        <TooltipButton
                            tooltipTitle="Clear Search and Color Filter"
                            onClick={clearSearch}
                        >
                            <Clear />
                        </TooltipButton>
                    </Box>
                </Box>
            </Box>

            <Box className={classes.ActionButtons}>
                {syncButton}
                <button onClick={props.startLogout} className={classes.Logout}>
                    Logout
                </button>
            </Box>
        </header>
    );
}

const mapStateToProps = (state) => {
    return {
        text: state.filters.filterText,
        color: state.filters.filterColor,
        sidebarOpen: state.ui.sidebarOpenMobile,
        syncStatus: state.ui.syncStatus,
        uid: state.auth.uid,
        main: state.main,
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        setFilterText: (filterText) => dispatch(setFilterText(filterText)),
        setFilterColor: (filterColor) => dispatch(setFilterColor(filterColor)),
        openSidebar: () => dispatch(openSidebar()),
        closeSidebar: () => dispatch(closeSidebar()),
        startLogout: () => dispatch(startLogout()),
        syncingStart: () => dispatch(syncingStart()),
        syncSuccess: () => dispatch(syncSuccess()),
        syncFail: () => dispatch(syncFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
