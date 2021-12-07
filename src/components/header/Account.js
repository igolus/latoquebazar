import React, {
    useRef,
    useState
} from 'react';
import {
    Avatar,
    Box,
    ButtonBase, Hidden,
    Menu,
    MenuItem,
    Typography,
} from '@material-ui/core';
import {makeStyles} from "@material-ui/styles";
import localStrings from "../../localStrings";
import {getCroppedProfileName} from "../../util/displayUtil";
import useAuth from "@hook/useAuth";
import Link from 'next/link'

const useStyles = makeStyles((theme) => ({
    avatar: {
        height: 32,
        width: 32,
        marginRight: 1
    },
    popover: {
        width: 200
    }
}));

const Account = ({noLinkMode}) => {
    const classes = useStyles();
    const ref = useRef(null);
    const { currentUser, logout, userInDb, dbUser } = useAuth();
    const [isOpen, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            setOpen(false);
            await logout();
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                component={ButtonBase}
                onClick={() => setOpen(true)}
                ref={ref}
            >

                <Avatar
                    alt="User"
                    className={classes.avatar}
                    src={currentUser()?.photoURL}
                />
                <Hidden smDown>
                    <Typography
                        variant="h6"
                        color="inherit"
                    >
                        {getCroppedProfileName(userInDb)}
                    </Typography>
                </Hidden>
            </Box>
            {!noLinkMode &&
            <Menu
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                keepMounted
                PaperProps={{ className: classes.popover }}
                getContentAnchorEl={null}
                anchorEl={ref.current}
                open={isOpen}
            >

                {/*<div>*/}
                {/*  <Link*/}
                {/*      href="/app/social/profile"*/}
                {/*  >*/}
                {/*    {localStrings.profile}*/}
                {/*  </Link>*/}
                {/*  <Link*/}
                {/*      href="/app/account"*/}
                {/*  >*/}
                {/*    {localStrings.account}*/}
                {/*  </Link>*/}
                {/*</div>*/}

                <MenuItem>
                    <Link href={"/profile"}>
                        {localStrings.myAccount}
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link href={"/orders"}>
                        {localStrings.myOrders}
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link href={"/address"}>
                        {localStrings.myAddresses}
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    {localStrings.logout}
                </MenuItem>
            </Menu>
                }
        </>
    );
}

export default Account;
