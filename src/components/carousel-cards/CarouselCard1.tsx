import BazarImage from '@component/BazarImage'
import {Paragraph} from '@component/Typography'
import {Box, Button, Grid, styled} from '@material-ui/core'
import React from 'react'
import Link from 'next/link'
import MdRender from "@component/MdRender";
import useWindowSize from "@hook/useWindowSize";
import {WIDTH_DISPLAY_MOBILE} from "../../util/constants";
import {renderMd} from "../../../pages/specialPage/[id]";

export interface CarouselCard1Props {
    imageUrl?: string
    title?: string
    subTitle?: string
    action?: string
    actionText?: string
    openInNewTab?: boolean
    actionSecond?: string
    actionTextSecond?: string
    marginBottom?: string
    openInNewTabSecond?: boolean
    customContent: string
    useCustomContent: boolean
    odd: boolean
}

const StyledBox = styled(Box)(({ theme, odd}) => ({
    backgroundColor: 'grey.500',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '.title': {
        fontSize: 50,
        marginTop: 0,
        marginBottom: '1.35rem',
        lineHeight: 1.2,
    },
    [theme.breakpoints.up('sm')]: {
        '.grid-item': {
            minHeight: 424,
            display: 'flex',
            alignItems: 'baseline',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        '.grid-item-right': {
            minHeight: 424,
            display: 'flex',
            alignContent: 'flex-end',
            alignItems: 'flex-end',
            flexDirection: 'column',
            justifyContent: 'center',
        },
    },
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        paddingLeft: 0,

        '.title': {
            fontSize: 32,
        },
    },
    [theme.breakpoints.down('xs')]: {
        '.title': {
            fontSize: 16,
        },
        '.title + *': {
            fontSize: 13,
        },
        '.button-link': {
            height: 36,
            padding: '0 1.5rem',
            fontSize: 13,
        },
    },
}))

const CarouselCard1: React.FC<CarouselCard1Props> = ({imageUrl, title,
                                                         subTitle,
                                                         action,
                                                         actionText,
                                                         openInNewTab,
                                                         actionSecond,
                                                         actionTextSecond,
                                                         openInNewTabSecond,
                                                         marginBottom,
                                                         customContent,
                                                         useCustomContent,
                                                         odd}) => {

    const width = useWindowSize()

    if (odd || width < WIDTH_DISPLAY_MOBILE) {
        return (
            // <div style={{backgroundColor: 'red', width:'100%'}} >
                <StyledBox>
                <Grid container spacing={3} alignItems="center" justifyContent="center" mb={marginBottom || "0"}>
                    <Grid item className="grid-item" sm={imageUrl ? 5 : 12} xs={12}>
                        <h1 className="title">{title}</h1>
                        <Paragraph color="secondary.main" mb={2.7}>
                            <MdRender content={subTitle}/>
                        </Paragraph>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}
                        >
                            {
                                action && actionText &&
                                <Link href={action} target={openInNewTab ? "_new" : "_self"}>
                                    <Button
                                        className="button-link"
                                        variant="outlined"
                                        color="primary"
                                        disableElevation
                                        sx={{
                                            mr: "10px",
                                            px: '1.75rem',
                                            height: '44px',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        {actionText}
                                    </Button>
                                </Link>
                            }

                            {actionSecond && actionTextSecond &&
                            <Link href={actionSecond} target={openInNewTabSecond ? "_new" : "_self"}>
                                <Button
                                    className="button-link"
                                    variant="outlined"
                                    color="primary"
                                    disableElevation
                                    sx={{
                                        px: '1.75rem',
                                        height: '44px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {actionTextSecond}
                                </Button>
                            </Link>
                            }
                        </Box>

                    </Grid>
                    {imageUrl && !useCustomContent &&
                    <Grid item sm={5} xs={12}>
                        <BazarImage
                            src={imageUrl}
                            alt="apple-watch-1"
                            sx={{
                                display: 'block',
                                mx: 'auto',
                                maxHeight: 400,
                                maxWidth: '100%',
                            }}
                        />
                    </Grid>
                    }
                    {useCustomContent && customContent &&
                    <Grid item sm={5} xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <div
                                dangerouslySetInnerHTML={{__html: renderMd(customContent)}}
                            />
                        </Box>
                    </Grid>
                    }
                </Grid>
            </StyledBox>
            // </div>
        )
    }
    else {
        return (
            <StyledBox>
                <Grid container spacing={3} alignItems="center" justifyContent="center" mb={marginBottom || "0"}>
                    {imageUrl && !useCustomContent &&
                    <Grid item sm={5} xs={12}>
                        <BazarImage
                            src={imageUrl}
                            alt="apple-watch-1"
                            sx={{
                                display: 'block',
                                mx: 'auto',
                                maxHeight: 400,
                                maxWidth: '100%',
                            }}
                        />
                    </Grid>
                    }
                    {useCustomContent && customContent &&
                        <Grid item sm={5} xs={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <div
                                    dangerouslySetInnerHTML={{__html: renderMd(customContent)}}
                                />
                            </Box>
                        </Grid>
                    }
                    <Grid item className="grid-item-right" sm={imageUrl ? 5 : 12}  xs={12}>
                        <h1 className="title">{title}</h1>
                        <Paragraph color="secondary.main" mb={2.7}>
                            <MdRender content={subTitle}/>
                        </Paragraph>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {
                                action && actionText &&
                                <Link href={action} target={openInNewTab ? "_new" : "_self"}>
                                    <Button
                                        className="button-link"
                                        variant="outlined"
                                        color="primary"
                                        disableElevation
                                        sx={{
                                            px: '1.75rem',
                                            height: '44px',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        {actionText}
                                    </Button>
                                </Link>
                            }

                            {actionSecond && actionTextSecond &&
                            <Link href={actionSecond} target={openInNewTabSecond ? "_new" : "_self"}>
                                <Button
                                    className="button-link"
                                    variant="outlined"
                                    color="primary"
                                    disableElevation
                                    sx={{
                                        ml: "10px",
                                        px: '1.75rem',
                                        height: '44px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {actionTextSecond}
                                </Button>
                            </Link>
                            }
                        </Box>

                    </Grid>

                </Grid>
            </StyledBox>
        )
    }
}

export default CarouselCard1
