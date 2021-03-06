import FlexBox from '@component/FlexBox'
import CustomerDashboardLayout from '@component/layout/CustomerDashboardLayout'
import DashboardPageHeader from '@component/layout/DashboardPageHeader'
import TableRow from '@component/TableRow'
import {H3, H5, Small} from '@component/Typography'
import {Button, Card, Grid, Tooltip} from '@material-ui/core'
import Person from '@material-ui/icons/Person'
import {Box} from '@material-ui/system'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import {isMobile} from 'react-device-detect';
import useAuth from "@hook/useAuth";
import LoginOrSignup from "@component/sessions/LoginOrSignup";
import localStrings from "../../src/localStrings";
import {GetStaticProps} from "next";
import {getStaticPropsUtil} from "../../src/nextUtil/propsBuilder";
import Account from "@component/header/Account";
import {getProfileName} from "../../src/util/displayUtil";
import {executeMutationUtil, executeQueryUtil, executeQueryUtilSync} from "../../src/apolloClient/gqlUtil";
import {getCustomerOrdersQuery} from "../../src/gql/orderGql";
import {ORDER_STATUS_FINISHED} from "../../src/util/constants";
import {useRouter} from "next/router";
import AppLayout from "@component/layout/AppLayout";
import Navbar from "@component/navbar/Navbar";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import {getSiteUserByIdQuery, updateSiteUserQuery} from "../../src/gql/siteUserGql";

export interface ProfileProps {
    contextData?: any
}

const Profile:React.FC<ProfileProps> = ({contextData}) => {

    const {getContextDataAuth} = useAuth();
    function getContextData() {
        if (getContextDataAuth()) {
            return getContextDataAuth()
        }
        return contextData;
    }

    const router = useRouter();
    const [awaitingOrdersCount, setAwaitingOrdersCount] = useState(0);
    const {dbUser, logout, currentUser, orderCount, brand, currentBrand, setDbUser} = useAuth()

    useEffect(() => {
            if (!dbUser && !isMobile) {
                //alert("push user")
                router.push("/profile")
            }
        },
        [dbUser]
    )

    useEffect(() => {
            const reloadUser = async () => {
                let result = await executeQueryUtil(getSiteUserByIdQuery(currentBrand() ? currentBrand().id : contextData.brand.id, dbUser.id));
                //alert("result.data.getSiteUser " + JSON.stringify(result.data.getSiteUser))
                setDbUser({
                    ...dbUser,
                    loyaltyPoints: result.data.getSiteUser?.loyaltyPoints || 0
                });

            }
            if (dbUser) {
                reloadUser()
            }
        },
        []
    )

    useEffect(async () => {

        if (dbUser && brand) {
            let result = await executeQueryUtil(getCustomerOrdersQuery(brand.id, dbUser.id));
            if (result && result.data) {
                let orders = result.data.getSiteUser.orders;
                let awaitingOrders = orders.filter(order => order.status !== ORDER_STATUS_FINISHED);
                setAwaitingOrdersCount(awaitingOrders.length)
            }
        }

    }, [dbUser, brand]);


    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    };


    function getInfoList() {
        return [
            {
                title: orderCount,
                subtitle: localStrings.orderCount,
            },
            {
                title: awaitingOrdersCount,
                subtitle: localStrings.awaitingOrders,
            }
        ]
    }

    function getLoginImg() {
        return getContextData()?.brand?.config?.loginImg || "/assets/images/login.jpg";
    }

    return (
        <>
            {isMobile && !dbUser &&
            <Box mb={4}>
                <Grid container spacing={3}>
                    <LoginOrSignup/>
                </Grid>
            </Box>

            }

            {dbUser &&
            <CustomerDashboardLayout title={localStrings.profile}
                                     description={localStrings.profileDesc} contextData={getContextData()} >

                {isMobile && !dbUser ?
                    <>
                        <Box mb={4}>
                            <Grid container spacing={3}>
                                <LoginOrSignup/>
                            </Grid>
                        </Box>
                    </>
                    :

                    <>
                        <DashboardPageHeader
                            icon={Person}
                            title={localStrings.myProfile}
                            button={
                                <Box display="flex" flexDirection="row-reverse" p={1} m={1}>

                                    {dbUser &&
                                    <Box p={1}>
                                        <Button
                                            variant="contained"
                                            onClick={handleLogout}
                                            color="primary" sx={{px: '2rem'}}>
                                            {localStrings.logout}
                                        </Button>
                                    </Box>
                                    }

                                    <Box p={1}>
                                        <Link href="/profile/edit">
                                            <Button color="primary" variant="contained" sx={{px: '2rem'}}>
                                                {localStrings.editProfile}
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                            }
                        />

                        {currentUser != null && dbUser &&
                        <>
                            {currentBrand()?.config?.loyaltyConfig?.useLoyalty &&
                            <Box mb={4}>
                                <Grid container spacing={3}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Card
                                            sx={{
                                                display: 'flex',
                                                p: '14px 32px',
                                                height: '100%',
                                                alignItems: 'center',
                                            }}
                                        >

                                            <Box ml={1.5} flex="1 1 0">
                                                <FlexBox
                                                    flexWrap="wrap"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <H3 my="0px" fontWeight="600">
                                                        {localStrings.loyaltyPoints}
                                                    </H3>

                                                    <H5 my="0px">{localStrings.formatString(localStrings.loyaltyPointNumber, dbUser?.loyaltyPoints || 0)}</H5>
                                                    {dbUser?.loyaltyPoints < currentBrand()?.config?.loyaltyConfig?.minPointSpend ?
                                                        // {dbUser?.loyaltyPoints ?
                                                        <Small color="grey.600" textAlign="center">
                                                            {localStrings.formatString(localStrings.loyaltyRemainsToSpent, (currentBrand()?.config?.loyaltyConfig?.minPointSpend - dbUser?.loyaltyPoints))}
                                                        </Small>
                                                        :
                                                        <Tooltip title={localStrings.loyaltyCanUsuPoints}>
                                                            <CheckCircleOutlineIcon/>
                                                        </Tooltip>
                                                    }
                                                </FlexBox>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                            }
                            <Box mb={4}>
                                <Grid container spacing={3}>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <Card
                                            sx={{
                                                display: 'flex',
                                                p: '14px 32px',
                                                height: '100%',
                                                alignItems: 'center',
                                            }}
                                        >

                                            <Account noLinkMode/>
                                            {/*<Avatar*/}
                                            {/*    src="/assets/images/faces/ralph.png"*/}
                                            {/*    sx={{height: 64, width: 64}}*/}
                                            {/*/>*/}
                                            <Box ml={1.5} flex="1 1 0">
                                                <FlexBox
                                                    flexWrap="wrap"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <div>
                                                        <H5 my="0px">{getProfileName(dbUser)}</H5>
                                                        {/*<FlexBox alignItems="center">*/}
                                                        {/*    <Typography color="grey.600">Balance:</Typography>*/}
                                                        {/*    <Typography ml={0.5} color="primary.main">*/}
                                                        {/*        $500*/}
                                                        {/*    </Typography>*/}
                                                        {/*</FlexBox>*/}
                                                    </div>

                                                    {/*<Typography color="grey.600" letterSpacing="0.2em">*/}
                                                    {/*    SILVER USER*/}
                                                    {/*</Typography>*/}
                                                </FlexBox>
                                            </Box>
                                        </Card>
                                    </Grid>

                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <Grid container spacing={4}>
                                            {getInfoList().map((item) => (
                                                // <a>
                                                    <Grid item lg={6} sm={6} xs={6} key={item.subtitle}>
                                                    <Link href="/orders">
                                                        <a>
                                                            <Card
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    height: '100%',
                                                                    p: '1rem 1.25rem',
                                                                }}
                                                            >
                                                                <H3 color="primary.main" my="0px" fontWeight="600">
                                                                    {item.title}
                                                                </H3>
                                                                <Small color="grey.600" textAlign="center">
                                                                    {item.subtitle}
                                                                </Small>
                                                            </Card>
                                                        </a>
                                                    </Link>
                                                </Grid>
                                                // </a>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>

                            <TableRow sx={{p: '0.75rem 1.5rem'}}>
                                <FlexBox flexDirection="column" p={1}>
                                    <Small color="grey.600" mb={0.5} textAlign="left">
                                        {localStrings.firstName}
                                    </Small>
                                    <span>{dbUser?.userProfileInfo?.firstName || "-"}</span>
                                </FlexBox>
                                <FlexBox flexDirection="column" p={1}>
                                    <Small color="grey.600" mb={0.5} textAlign="left">
                                        {localStrings.lastName}
                                    </Small>
                                    <span>{dbUser?.userProfileInfo?.lastName || "-"}</span>
                                </FlexBox>
                                <FlexBox flexDirection="column" p={1}>
                                    <Small color="grey.600" mb={0.5} textAlign="left">
                                        {localStrings.email}
                                    </Small>
                                    <span>{dbUser?.userProfileInfo?.email || "-"}</span>
                                </FlexBox>
                                <FlexBox flexDirection="column" p={1}>
                                    <Small color="grey.600" mb={0.5} textAlign="left">
                                        {localStrings.phone}
                                    </Small>
                                    <span>{dbUser?.userProfileInfo?.phoneNumber || "-"}</span>
                                </FlexBox>

                                {/*<FlexBox flexDirection="column" p={1}>*/}
                                {/*    <Small color="grey.600" mb={0.5} textAlign="left">*/}
                                {/*        {localStrings.address}*/}
                                {/*    </Small>*/}
                                {/*    <span>{dbUser?.userProfileInfo?.address || "-"}</span>*/}
                                {/*</FlexBox>*/}

                            </TableRow>
                        </>
                        }
                    </>
                }
            </CustomerDashboardLayout>
            }

            {!dbUser && !isMobile && contextData &&
            <AppLayout contextData={contextData} navbar={<Navbar contextData={contextData}/>}>

                <Grid container spacing={3}>
                    <Grid
                        item
                        lg={6}
                        xs={12}
                        sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
                    >
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            minHeight="100vh"
                            m={4}>
                            <LoginOrSignup contextData={contextData}/>
                        </Box>
                    </Grid>

                    <Grid
                        item
                        lg={6}
                        xs={12}
                        sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
                    >
                        <Box m={4}>
                            <img style={{width:"100%", height:"100%"}} src= {getLoginImg()}/>
                        </Box>
                    </Grid>
                </Grid>
            </AppLayout>

            }
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return await getStaticPropsUtil();
}

export default Profile
