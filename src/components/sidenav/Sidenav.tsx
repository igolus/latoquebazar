import {Box, Button, Drawer, IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import clsx from 'clsx'
import React, {cloneElement, Fragment, useEffect, useState} from 'react'
import Close from '@material-ui/icons/Close';
import {useRouter} from "next/router";
import navbarNavigations from "@data/navbarNavigations";
import useAuth from "@hook/useAuth";
import Link from "next/link";
import localStrings from "../../localStrings";

const useStyles = makeStyles(() => ({
  handle: {
    cursor: 'pointer',
  },
}))

export interface SidenavProps {
  position?: 'left' | 'right'
  open?: boolean
  width?: number
  handle: React.ReactElement
  toggleSidenav?: () => void
  extraPages: any
  profileSideBar: boolean
  nbEsta: number
}

const Sidenav: React.FC<SidenavProps> = ({
  position,
  open,
  width,
  handle,
  toggleSidenav,
  extraPages,
  profileSideBar,
  nbEsta
}) => {
  const [sidenavOpen, setSidenavOpen] = useState(open)
  const classes = useStyles()
  const {dbUser, setEstanavOpen} = useAuth()
  const { pathname } = useRouter()

  const checkRouteMatch = (href: string, regExpMatch: string) => {
    if (href === '/') return pathname === href
    return pathname.includes(href) || (regExpMatch && pathname.match(new RegExp(regExpMatch)))
  }

  const handleToggleSidenav = () => {
    setSidenavOpen(!sidenavOpen)
  }

  useEffect(() => {
    setSidenavOpen(open)
  }, [open])

  return (
    <Fragment>
      <Drawer
        open={sidenavOpen}
        anchor={position}
        onClose={toggleSidenav || handleToggleSidenav}
        SlideProps={{ style: { width: width || 280 } }}
      >

        <Box>
          <Box
              display={'flex'}
              justifyContent={'flex-end'}
              onClick={handleToggleSidenav}
          >
            <IconButton>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Box paddingX={2} paddingBottom={2}>
            {
              navbarNavigations(dbUser, extraPages, profileSideBar).map((nav, key) =>
                <Box marginTop={1} key={key}>
                  <Link href={nav.url}>
                    <Button
                        variant={checkRouteMatch(nav.url, nav.regExpMatch) ? "contained" : "outlined"}
                        color="primary"
                        fullWidth
                    >
                      {nav.title}
                    </Button>
                  </Link>
                </Box>
            )}

            {nbEsta > 1 &&
                <Box marginTop={1}>
                  {/*<Link href={nav.url}>*/}
                    <Button
                        variant="outlined"
                        onClick={() => {
                          setEstanavOpen(true);
                          setSidenavOpen(false);
                        }}
                        color="primary"
                        fullWidth
                    >
                      {localStrings.selectEsta2}
                    </Button>
                </Box>
            }
          </Box>
        </Box>


      </Drawer>

      {handle &&
        cloneElement(handle, {
          className: clsx(handle.props?.className, classes.handle),
          onClick: toggleSidenav || handleToggleSidenav,
        })}
    </Fragment>
  )
}

Sidenav.defaultProps = {
  width: 280,
  position: 'left',
  open: false,
}

export default Sidenav
