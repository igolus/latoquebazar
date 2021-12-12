import BazarButton from '@component/BazarButton'
import Image from '@component/BazarImage'
import CategoryMenu from '@component/categories/CategoryMenu'
import FlexBox from '@component/FlexBox'
import Category from '@component/icons/Category'
import ShoppingBagOutlined from '@component/icons/ShoppingBagOutlined'
import MiniCart from '@component/mini-cart/MiniCart'
import {
    Badge,
    Box,
    Container,
    Dialog,
    Drawer,
    IconButton, Tooltip,
    useMediaQuery,
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import LocationOn from '@material-ui/icons/LocationOn'

import PersonOutline from '@material-ui/icons/PersonOutline'
import { makeStyles } from '@material-ui/styles'
import { MuiThemeProps } from '@theme/theme'
import clsx from 'clsx'
import Link from 'next/link'
import React, { useState } from 'react'
import SearchBox from '../search-box/SearchBox'
import Account from './Account'
import useAuth from "@hook/useAuth";
import LoginOrSignup from "@component/sessions/LoginOrSignup";
import {getItemNumberInCart} from "../../util/cartUtil";
import {layoutConstant} from "../../util/constants";
import {isMobile} from "react-device-detect";
import {useRouter} from "next/router";
import localStrings from "../../localStrings";
import {firstOrCurrentEstablishment} from "../../util/displayUtil";
import SelectEsta from '../SelectEsta';

type HeaderProps = {
    className?: string
    isFixed?: boolean
    contextData: any
}

const useStyles = makeStyles(({ palette, ...theme }: MuiThemeProps) => ({
    root: {
        position: 'relative',
        zIndex: 999,
        height: layoutConstant.headerHeight,
        background: palette.background.paper,
        transition: 'height 250ms ease-in-out',
        [theme.breakpoints.down('sm')]: {
            height: layoutConstant.mobileHeaderHeight,
        },

    },
    backDrop: {
        backdropFilter: "blur(5px)",
        backgroundColor:'rgba(0,0,30,0.4)'
    },
}))

const Header: React.FC<HeaderProps> = ({ isFixed, className , contextData}) => {
    const [sidenavOpen, setSidenavOpen] = useState(false)
    // const [estanavOpen, setEstanavOpen] = useState(false)
    //const {loginDialogOpen, setLoginDialogOpen} = useState(false)
    const router = useRouter()
    //alert("contextData brand " + contextData.brand)
    const {currentUser, getOrderInCreation, loginDialogOpen, setLoginDialogOpen,
        dbUser, currentEstablishment, setEstanavOpen, estanavOpen} = useAuth();
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
    const logoUrl = contextData ? contextData.brand.logoUrl : null;
    const brandName = contextData ? contextData.brand.brandName : null;

    const toggleSidenav = () => setSidenavOpen(!sidenavOpen)
    const toggleEstanav = () => setEstanavOpen(!estanavOpen)
    const toggleDialog = () => setLoginDialogOpen(!loginDialogOpen)


    const classes = useStyles()

    const cartHandle = (
        <Badge badgeContent={getItemNumberInCart(getOrderInCreation)} color="primary">
            <Box
                component={IconButton}
                ml={2.5}
                bgcolor="grey.200"
                p={1.25}
                onClick={toggleSidenav}
            >
                <ShoppingBagOutlined />
            </Box>
        </Badge>
    )

    return (
        <div className={clsx(classes.root, className)}>
            <Container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                }}
            >
                <FlexBox
                    alignItems="center"
                    mr={2}
                    minWidth="170px"
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                    <Link href="/">
                        <a>
                            {logoUrl &&
                            <Image mb={0.5} src={logoUrl} alt={brandName || "logo"}/>
                            }
                        </a>
                    </Link>

                    {isFixed && (

                        <CategoryMenu contextData={contextData}>
                            <FlexBox color="grey.600" alignItems="center" ml={2}>
                                <BazarButton color="inherit">
                                    <Category fontSize="small" color="inherit" />
                                    <KeyboardArrowDown fontSize="small" color="inherit" />
                                </BazarButton>
                            </FlexBox>
                        </CategoryMenu>
                    )}
                </FlexBox>

                <FlexBox justifyContent="center" flex="1 1 0">
                    <SearchBox />
                </FlexBox>

                <FlexBox alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {/*<Link href={}*/}
                    <Box
                        component={IconButton}
                        ml={2}
                        p={1.25}
                        bgcolor="grey.200"

                        onClick={() => {
                            if (!currentUser() || !dbUser) {
                                router.push("/profile")
                                //toggleDialog();
                            }
                        }}
                    >
                        {currentUser != null && dbUser ?
                            <Account />
                            :
                            <PersonOutline />
                        }
                    </Box>

                    {contextData && contextData.establishments && contextData.establishments.length > 1 &&
                    <Tooltip title={firstOrCurrentEstablishment(currentEstablishment, contextData).establishmentName}>
                        <Box
                            component={IconButton}
                            ml={2.5}
                            bgcolor="grey.200"
                            p={1.25}
                            onClick={() => {
                                //alert("setEstanavOpen")
                                setEstanavOpen(true);
                            }}
                        >
                            <LocationOn/>
                        </Box>
                    </Tooltip>
                    }
                    {cartHandle}

                </FlexBox>

                {/*<p>{estanavOpen ? "open" : "close"}</p>*/}

                <Dialog
                    BackdropProps={{
                        classes: {
                            root: classes.backDrop,
                        },
                    }}
                    //style={customeStyle}
                    open={loginDialogOpen}
                    fullWidth={isMobile}
                    scroll="body"
                    onClose={() => setLoginDialogOpen(false)}
                >
                    <LoginOrSignup closeCallBack={() => setLoginDialogOpen(false)} contextData={contextData}/>
                </Dialog>

                <Drawer
                    BackdropProps={{
                        classes: {
                            root: classes.backDrop,
                        },
                    }}
                    open={sidenavOpen} anchor="right" onClose={toggleSidenav}>
                    <MiniCart contextData={contextData}/>
                </Drawer>

                {contextData && contextData.establishments && contextData.establishments.length > 1 &&
                <Drawer
                    BackdropProps={{
                        classes: {
                            root: classes.backDrop,
                        },
                    }}
                    open={estanavOpen} anchor="top" onClose={() => setEstanavOpen(false)}>
                    {/*<h1>HEADER</h1>*/}
                    <SelectEsta contextData={contextData} closeCallBack={() => setEstanavOpen(false)}/>
                </Drawer>
                }
            </Container>

            {/*<Container*/}
            {/*    sx={{*/}
            {/*        display: 'flex',*/}
            {/*        alignItems: 'center',*/}
            {/*        justifyContent: 'space-between',*/}
            {/*        height: '100%',*/}
            {/*    }}*/}
            {/*>*/}

            {/*    <Drawer*/}
            {/*        BackdropProps={{*/}
            {/*            classes: {*/}
            {/*                root: classes.backDrop,*/}
            {/*            },*/}
            {/*        }}*/}
            {/*        open={estanavOpen} anchor="top" onClose={toggleEstanav}>*/}
            {/*        /!*<h1>HEADER</h1>*!/*/}
            {/*        <SelectEsta contextData={contextData} closeCallBack={() => setEstanavOpen(false)}/>*/}
            {/*    </Drawer>*/}

            {/*    /!*<h1>select esta</h1>*!/*/}
            {/*</Container>*/}
        </div>
    )
}

const customeStyle =  {
    content : {
        top                   : 'auto',
        left                  : 'auto',
        right                 : 'auto',
        bottom                : '0',
        marginRight           : 'auto',
        //width:'100%'
    },
    overlay: {
        backdropFilter: 'blur(45px)',
    },
    backgroundColor:'rgba(253,255,255,0.44)',
}

export default Header
