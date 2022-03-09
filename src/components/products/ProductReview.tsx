import FlexBox from '@component/FlexBox'
import { H2, H5 } from '@component/Typography'
import {Box, Button, CircularProgress, TextField} from '@material-ui/core'
import { Rating } from '@material-ui/lab'
import { useFormik } from 'formik'
import React, {useEffect, useState} from 'react'
import * as yup from 'yup'
import ProductComment from './ProductComment'
import localStrings from "../../localStrings";
import useAuth from "@hook/useAuth";
import {executeMutationUtil, executeQueryUtil} from "../../apolloClient/gqlUtil";
import {createProductReviewMutation, getProductReviewsQuery, updateProductReviewMutation} from "../../gql/productReviewGql";
import {getProfileName} from "../../util/displayUtil";
import BazarButton from "@component/BazarButton";
import {makeStyles} from "@material-ui/styles";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    color: green[500],
  },
}));

export interface ProductReviewProps {
  productReviews?: any
  productId: string
  modeEdit?: boolean
  updateValues?: any
  closeCallBack?: any
  updateCallBack?: any
}

const ProductReview: React.FC<ProductReviewProps> = ({
                                                       productReviews,
                                                       productId,
                                                       modeEdit,
                                                       closeCallBack,
                                                       updateCallBack,
                                                       updateValues}) => {

  const classes = useStyles();
  const [productReviewItems, setProductReviewItems] = useState(productReviews);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const {dbUser, setLoginDialogOpen, currentBrand, currentUser} = useAuth();

  const handleFormSubmit = async (values: any, { resetForm }: any) => {
    setLoading(true);
    // alert("handleFormSubmit" );
    try {
      if (!dbUser) {
        setLoginDialogOpen(true);
        return;
      }

      let dataCreate = {
        comment: values.comment,
        stars: values.stars,
        //creationDate: String
        userName: getProfileName(dbUser),
        userIconUrl: currentUser()?.photoURL,
        userId: dbUser.id,
        userEmail: dbUser.userProfileInfo.email
      }

      if (modeEdit) {
        dataCreate.answerResponse = updateValues.answerResponse;
        dataCreate.answerUserIconUrl = updateValues.answerUserIconUrl;
        dataCreate.productId = updateValues.productId;

        // let resExisting = (productReviewItems || []).find(item => item.id === updateValues.id);
        // alert("resExisting" + JSON.stringify(resExisting || {}))
        let dataUpdate = {
          ...dataCreate,
          id: updateValues.id,
        };
        console.log("dataUpdate " + JSON.stringify(dataUpdate, null, 2));
        await executeMutationUtil(updateProductReviewMutation(currentBrand()?.id, productId, dataUpdate))
      } else {
        await executeMutationUtil(createProductReviewMutation(currentBrand()?.id, productId, dataCreate))
      }

      setReload(!reload);

      console.log(JSON.stringify(values));

      if (updateCallBack) {
        updateCallBack();
      } else if (closeCallBack) {
        closeCallBack();
      }

      resetForm()
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const getComments = async () => {
      if (currentBrand() && dbUser) {
        let resReviews = await executeQueryUtil(getProductReviewsQuery(currentBrand()?.id, productId))
        setProductReviewItems(resReviews?.data?.getProductReviews);
      }
    };
    if (!modeEdit) {
      getComments()
    }
  }, [reload, currentBrand(), dbUser])

  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues(updateValues),
    validationSchema: reviewSchema,
    onSubmit: handleFormSubmit,
  })

  return (
      <Box mt={2}>
        {/*<p>{JSON.stringify(productReviewItems || [])}</p>*/}

        {!modeEdit && (productReviewItems || []).sort((a,b) => b.updateDate - a.updateDate).map((item, ind) => (
            <ProductComment {...item}
                            productId={productId}
                            handleReload={() => setReload(!reload)}
                            key={ind} />
        ))}

        <H2 fontWeight="600" mt={7} mb={2.5}>
          {modeEdit ? localStrings.updateReview :
              (!productReviewItems || productReviewItems.length === 0 ? localStrings.writeReviewFirst : localStrings.writeReview)}
        </H2>

        <form onSubmit={handleSubmit}>
          <Box mb={2.5}>
            <FlexBox mb={1.5}>
              <H5 color="grey.700" mr={0.75}>
                {localStrings.yourRating}
              </H5>
              <H5 color="error.main">*</H5>
            </FlexBox>

            <Rating
                color="warn"
                size="medium"
                value={values.stars || 0}
                onChange={(_, value) => setFieldValue('stars', value)}
            />
          </Box>

          <Box mb={3}>
            <FlexBox mb={1.5}>
              <H5 color="grey.700" mr={0.75}>
                {localStrings.yourReview}
              </H5>
              <H5 color="error.main">*</H5>
            </FlexBox>

            <TextField
                name="comment"
                placeholder={localStrings.writeReviewHere}
                variant="outlined"
                multiline
                fullWidth
                rows={8}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.comment || ''}
                error={!!touched.comment && !!errors.comment}
                helperText={touched.comment && errors.comment}
            />
          </Box>

          {dbUser ?
              <>
                {closeCallBack &&
                <Button
                    sx={{marginRight:1}}
                    onClick={() => closeCallBack()}
                    variant="outlined"
                    color="primary"
                >
                  {localStrings.cancel}
                </Button>
                }
                <BazarButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading && !modeEdit && !(dirty && isValid)}
                    endIcon={loading ?
                        <CircularProgress size={30} className={classes.buttonProgress}/> : <></>}
                >
                  {modeEdit ? localStrings.update: localStrings.postReview}
                </BazarButton>

              </>
              :
              <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setLoginDialogOpen(true)}
              >
                {localStrings.connectWriteComment}
              </Button>
          }
        </form>
      </Box>
  )
}

const initialValues = (updateValues: any) => {
  return (
      {
        stars: updateValues?.stars,
        comment: updateValues?.comment || '',
        answerResponse: updateValues?.answerResponse || '',
        answerUpdateDate: updateValues?.answerUpdateDate,
        answerUserIconUrl: updateValues?.answerUserIconUrl,
        date: new Date().toISOString(),
      })
}

const reviewSchema = yup.object().shape({
  stars: yup.number().required(localStrings.requiredField),
  comment: yup.string().required(localStrings.requiredField),
})

export default ProductReview
