import { CSSProperties, makeStyles } from '@material-ui/styles'
import { MuiThemeProps } from '@theme/theme'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {AnchorHTMLAttributes, useRef, useState} from 'react'
import {Box, Menu, MenuItem, MenuList, Typography} from "@material-ui/core";
import localStrings from "../../localStrings";

const useStylesCurrent = makeStyles(({ palette }: MuiThemeProps) => ({
    root:
        {
            position: 'relative',
            color: palette.primary.main,
            transition: 'all 0.3s ease-in-out',
            '&:before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '2px',
                bottom: '-3px',
                left: '50%',
                transform: 'translate(-50%,0%)',
                backgroundColor: palette.primary.main,
            },
        },
    popover: {
        width: 200,
    },
}))

const useStyles = makeStyles(({ palette }: MuiThemeProps) => ({
    root:
    {
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            color: `${palette.primary.main} !important`,
        },
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '0',
            height: '2px',
            bottom: '-3px',
            left: '50%',
            transform: 'translate(-50%,0%)',
            backgroundColor: palette.primary.main,
            visibility: 'hidden',
            transition: 'all 0.3s ease-in-out',
        },
        '&:hover:before': {
            visibility: 'visible',
            width: '100%',
            //backgroundColor: isCurrentRoute && palette.primary.main,
        },
    },
    popover: {
        width: 200,
    },
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
        if (href === '/') {
            //console.log("pathname " + pathname);
            return pathname === href
        }
        return pathname.includes(href) || (regExpMatch && pathname.match(new RegExp(regExpMatch)))
    }

    const classes = useStyles()
    const classesCurrent = useStylesCurrent()
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
                        <Link href={"/contactInfo"}>
                            {localStrings.openingAndLocation}
                        </Link>
                    </MenuItem>

                    {pageChildren.map((page, key) => {
                            const url = '/specialPage/' + page.id
                            return(
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
                </Menu>
            </>
        )
    }

    return (
        <>
            <Link href={href}>
                <a
                    className={clsx( checkRouteMatch(href) ? classesCurrent.root : classes.root, className)}
                    href={href}
                    style={style}
                    {...props}
                >
                    {children}
                </a>
            </Link>
        </>
    )
}

export default NavLink
