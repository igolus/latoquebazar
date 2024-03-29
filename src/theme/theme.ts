import {createTheme, Theme} from '@material-ui/core/styles'
import {error, grey, primary, secondary, success, warning} from './themeColors'

const fontSize = 16

const fontFamily = [
  'acumin-pro',
  'Open Sans',
  'Roboto',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Fira Sans',
  'Droid Sans',
  'Helvetica Neue',
  'sans-serif',
  'Quizine',
  'ForbesTypefaceAlt',
  'fjord-font',
  'Selfie_Regular',
].join(',')

const customTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
})

// Create a theme instance.
const bazarTheme = createTheme({
  palette: {
    primary: {
      ...primary,
      light: primary[100],
    },
    secondary,
    error,
    warning,
    success,
    text: {
      primary: grey[900],
      secondary: grey[800],
      disabled: grey[400],
    },
    divider: grey[200],
    grey: { ...grey },
    background: {
      default: grey[100],
    },
  },
  typography: {
    fontSize,
    fontFamily,
    htmlFontSize: 16,
    body1: { fontSize, fontFamily: 'Lato' },
    body2: { fontSize, fontFamily: 'Lato' },
    // h1:  { fontSize, fontFamily: 'Courgette' },
    // h2:  { fontSize, fontFamily: 'Courgette' },
    // h3:  { fontSize, fontFamily: 'Courgette' },
    // h3:  { fontSize, fontFamily: 'Comforter' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '.hover_underline_animation': {
          display: "inline-block",
          position: "relative",
          color: "#0087ca",
          '& after': {
            content: "''",
            position: "absolute",
            width: "100%",
            transform: "scaleX(0)",
            height: "2px",
            bottom: "0",
            left: "0",
            backgroundColor: "#0087ca",
            transformOrigin: "bottom right",
            transition: "transform 0.25s ease-out"
          },
          '& hover': {
            '& after': {
              transform: "scaleX(1)",
              transformOrigin: "bottom left"
            }
          }

        },
        // 'hover_underline_animation_after': {
        //   content: "''",
        //   position: "absolute",
        //   width: "100%",
        //   transform: "scaleX(0)",
        //   height: "2px",
        //   bottom: "0",
        //   left: "0",
        //   backgroundColor: "#0087ca",
        //   transformOrigin: "bottom right",
        //   transition: "transform 0.25s ease-out"
        // },
        // 'hover_underline_animation_hover_after': {
        //   transform: "scaleX(1)",
        //   transformOrigin: "bottom left"
        // },


        h1:  {
          // fontFamily: 'Selfie_Regular',
          fontSize: '50px !important',
        },
        // h2:  {
        //   fontFamily: 'Selfie_Regular',
        //   // fontSize: '50px !important',
        // },
        ul: {
          margin: 0,
          padding: 0,
          listStyle: 'none',
        },
        p: {
          lineHeight: 1.75,
        },
        a: {
          textDecoration: 'none',
          color: 'inherit',
        },
        button: {
          fontFamily,
          fontSize,
        },
        '.MuiRating-sizeSmall': {
          fontSize: '20px',
        },
        '.bigFont': {
          fontSize: '85px',
        },
        '#nprogress .bar': {
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px !important',
          borderRadius: '0px 300px 300px 0px !important',
          zIndex: 1031,
          background: `${primary[500]} !important`,
          overflow: 'hidden',
        },
        '#nprogress .peg': {
          boxShadow: `0 0 10px ${primary[500]}, 0 0 5px ${primary[500]} !important`,
        },
      },
    },
    MuiPagination: {
      defaultProps: {
        variant: 'outlined',
        color: 'primary',
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'capitalize',
          minWidth: 0,
          minHeight: 0,
        },
      },
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          [customTheme.breakpoints.up('sm')]: {
            paddingLeft: '1rem',
            paddingRight: '1rem',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
  },
})

const theme = { ...customTheme, ...bazarTheme }

theme.shadows[1] = '0px 1px 3px rgba(3, 0, 71, 0.09)'
theme.shadows[2] = '0px 4px 16px rgba(43, 52, 69, 0.1)'
theme.shadows[3] = '0px 8px 45px rgba(3, 0, 71, 0.09)'

export type MuiThemeProps = Theme

export default theme
