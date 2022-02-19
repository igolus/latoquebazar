import { CSSProperties, makeStyles } from '@material-ui/styles'
import { MuiThemeProps } from '@theme/theme'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {AnchorHTMLAttributes, useRef, useState} from 'react'
import {Box, Menu, MenuItem, MenuList, Typography} from "@material-ui/core";
import localStrings from "../../localStrings";

const useStyles = makeStyles(({ palette }: MuiThemeProps) => ({
    root: ({ isCurrentRoute }: any) => ({
        position: 'relative',
        color: isCurrentRoute ? palette.primary.main : 'inherit',
        transition: 'color 150ms ease-in-out',
        '&:hover': {
            color: `${palette.primary.main} !important`,
        },
    }),
    popover: {
        width: 200,
    },
    // typoLink: ({ isCurrentRoute }: any) => ({
    //   color: isCurrentRoute ? palette.primary.main : 'inherit',
    // })

}))

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    regExpMatch: string
    style?: CSSProperties
    className?: string
    pageChildren: any
}


const NavLink: React.FC<NavLinkProps> = ({
                                             href,
                                             regExpMatch,
                                             children,
                                             style,
                                             className,
                                             pageChildren,
                                             ...props
                                         }) => {
    const { pathname } = useRouter()

    const checkRouteMatch = (href: string) => {
        if (href === '/') return pathname === href
        return pathname.includes(href) || (regExpMatch && pathname.match(new RegExp(regExpMatch)))
    }

    const classes = useStyles({ isCurrentRoute: checkRouteMatch() })
    const refBox = useRef(null);
    const [isNavInfoOpen, setNavInfoOpen] = useState(false);

    if (pageChildren) {
        return (
            <>

                <Box ref={refBox}
                     className={clsx(classes.root, className)}
                     style={style}
                     onClick={() => setNavInfoOpen(true)}
                     {...props}
                >

                    {children}
                </Box>

                <Menu
                    style={{margin: "0px", padding: "0px"}}
                    onClose={() => setNavInfoOpen(false)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    keepMounted
                    PaperProps={{ className: classes.popover }}
                    getContentAnchorEl={null}
                    anchorEl={refBox.current}
                    open={isNavInfoOpen}
                >

                    <MenuItem>
                        <Link href={"/specialPage/"}>
                            {localStrings.contactInfoPageTitle}
                            {/*<Typography*/}
                            {/*    color={checkRouteMatch(url) ? 'primary' : 'inherit'}>{page.title}</Typography>*/}
                        </Link>
                    </MenuItem>

                    {/*title: localStrings.contactInfoPageTitle,*/}
                    {/*url: '/contactInfo',*/}

                    {pageChildren.map((page, key) => {
                        const url = '/specialPage/' + page.id
                        return(

                            // <Link href={href}>
                            //     <a
                            //         className={clsx(classes.root, className)}
                            //         href={href}
                            //         style={style}
                            //         {...props}
                            //     >
                            //         {children}
                            //     </a>
                            // </Link>
                        <MenuItem key={key}>
                            <Link href={url}>
                                {page.title}
                                {/*<Typography*/}
                                {/*    color={checkRouteMatch(url) ? 'primary' : 'inherit'}>{page.title}</Typography>*/}
                            </Link>
                        </MenuItem>
                        )
                        }
                    )}


                    {/*<MenuItem>*/}
                    {/*  <Link href={"/profile"}>*/}
                    {/*      <Typography color={checkRouteMatch("/profile") ? 'primary' : 'inherit'}>{localStrings.myAccount}</Typography>*/}
                    {/*  </Link>*/}
                    {/*</MenuItem>*/}
                    {/*<MenuItem>*/}
                    {/*  <Link href={"/orders"}>*/}
                    {/*      <Typography color={checkRouteMatch("/orders") ? 'primary' : 'inherit'}>{localStrings.myOrders}</Typography>*/}
                    {/*  </Link>*/}
                    {/*</MenuItem>*/}
                </Menu>
            </>


        )
    }

    return (
        <Link href={href}>
            <a
                className={clsx(classes.root, className)}
                href={href}
                style={style}
                {...props}
            >
                {children}
            </a>
        </Link>
    )
}

export default NavLink
