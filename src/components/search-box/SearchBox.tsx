import {Box, TextField} from '@material-ui/core'
import SearchOutlined from '@material-ui/icons/SearchOutlined'
import {makeStyles} from '@material-ui/styles'
import {MuiThemeProps} from '@theme/theme'
import React, {useRef, useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import localStrings from "../../localStrings";


const useStyles = makeStyles(({ palette, ...theme }: MuiThemeProps) => ({
  searchIcon: {
    color: palette.grey[600],
    marginRight: 6,
  },
  dropdownHandler: {
    borderTopRightRadius: 300,
    borderBottomRightRadius: 300,
    whiteSpace: 'pre',
    borderLeft: `1px solid ${palette.text.disabled}`,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  searchResultCard: {
    position: 'absolute',
    top: '100%',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    width: '100%',
    zIndex: 99,
  },
}))

const SearchBox = () => {
  const router = useRouter()
  const linkSearch = useRef(null);
  //const [category, setCategory] = useState('All Categories')
  const [searchText, setSearchText] = useState("")
  const [redirect, setRedirect] = useState(false)
  //const [resultList, setResultList] = useState<string[]>([])
  const parentRef = useRef()

  const classes = useStyles()

  // const handleCategoryChange = (cat: any) => () => {
  //   setCategory(cat)
  // }

  // const search = debounce((e) => {
  //   const value = e.target?.value
  //
  //   if (!value) setResultList([])
  //   else setResultList(dummySearchResult)
  // }, 200)

  // const hanldeSearch = useCallback((event) => {
  //   event.persist()
  //   search(event)
  // }, [])

  // const handleDocumentClick = () => {
  //   setResultList([])
  // }

  // useEffect(() => {
  //   window.addEventListener('click', handleDocumentClick)
  //   return () => {
  //     window.removeEventListener('click', handleDocumentClick)
  //   }
  // }, [])

  // const categoryDropdown = (
  //     <BazarMenu
  //         direction="left"
  //         handler={
  //           <FlexBox
  //               className={classes.dropdownHandler}
  //               alignItems="center"
  //               bgcolor="grey.100"
  //               height="100%"
  //               px={3}
  //
  //               color="grey.700"
  //               component={TouchRipple}
  //           >
  //             <Box mr={0.5}>{category}</Box>
  //             <KeyboardArrowDownOutlined fontSize="small" color="inherit" />
  //           </FlexBox>
  //         }
  //     >
  //       {categories.map((item) => (
  //           <MenuItem key={item} onClick={handleCategoryChange(item)}>
  //             {item}
  //           </MenuItem>
  //       ))}
  //     </BazarMenu>
  // )

  function searchTrigger() {

    //alert("searchTrigger " + searchText);
    router.push("/product/search/" + searchText);

  }

  function changeSearchValue(event) {
    let value = event.target.value;
    setSearchText(value);
  }

  return (
      <>
        <Box
            position="relative"
            flex="1 1 0"
            maxWidth="670px"
            mx="auto"
            {...{ ref: parentRef }}
        >

          {/*<form*/}
          {/*    on*/}
          {/*    action="/product/search/drinks"*/}
          {/*    method="get">*/}
          {/*/!*<form>*!/*/}
            <TextField
                onKeyDown={(e) => {
                  if(e.keyCode == 13){
                    searchTrigger()
                    //console.log('value', e.target.value);
                    // put the login here
                  }
                }}

                variant="outlined"
                placeholder={localStrings.searchFor}
                fullWidth
                onChange={changeSearchValue}
                InputProps={{
                  sx: {
                    height: 44,
                    borderRadius: 300,
                    paddingRight: 0,
                    color: 'grey.700',
                    overflow: 'hidden',
                  },
                  //endAdornment: categoryDropdown,
                  endAdornment: (
                      <>
                        {searchText !== "" ?
                            <Link href={`/product/search/${searchText}`}

                            >
                              <a>
                                <SearchOutlined className={classes.searchIcon}
                                                style={{marginRight: "15px"}}
                                                fontSize="large"/>
                              </a>
                            </Link>
                            :
                            <SearchOutlined className={classes.searchIcon}
                                            style={{marginRight: "15px"}}
                                            fontSize="large"/>
                        }

                      </>
                      // <SearchOutlined className={classes.searchIcon} fontSize="small" />
                  ),
                }}
            />
          {/*</form>*/}

          {/*{!!resultList.length && (*/}
          {/*  <Card className={classes.searchResultCard} elevation={2}>*/}
          {/*    {resultList.map((item) => (*/}
          {/*      <Link href={`/product/search/${item}`} key={item}>*/}
          {/*        <MenuItem key={item}>{item}</MenuItem>*/}
          {/*      </Link>*/}
          {/*    ))}*/}
          {/*  </Card>*/}
          {/*)}*/}
        </Box>
      </>
  )
}

const categories = [
  'All Categories',
  'Car',
  'Clothes',
  'Electronics',
  'Laptop',
  'Desktop',
  'Camera',
  'Toys',
]

const dummySearchResult = [
  'Lord',
  'Asus',
  'Acer Aspire X453',
  'iPad Mini 3',
]

export default SearchBox
