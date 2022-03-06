import BazarAvatar from '@component/BazarAvatar'
import BazarRating from '@component/BazarRating'
import FlexBox from '@component/FlexBox'
import { H5, H6, Paragraph, Span } from '@component/Typography'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { getDateDifference } from '../../util/utils'
import React, {useState} from 'react'
import moment from "moment";
import useAuth from "@hook/useAuth";
import localStrings from "../../localStrings";
import {executeMutationUtil} from "../../apolloClient/gqlUtil";
import {deleteProductReviewMutation} from "../../gql/productReviewGql";
import ProductReview from "@component/products/ProductReview";

export interface ProductCommentProps {
    id: string
    productId: string
    comment: string
    stars: number
    creationDate: string
    userName: string
    userIconUrl: string
    userId: string
    handleReload: any
}

const ProductComment: React.FC<ProductCommentProps> = ({
                                                           id,
                                                           productId,
                                                           comment,
                                                           stars,
                                                           creationDate,
                                                           updateDate,
                                                           userName,
                                                           userIconUrl,
                                                           userId,
                                                           handleReload
                                                       }) => {

    const {dbUser, currentBrand} = useAuth();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [updateReview, setUpdateReview] = useState(false);

    async function handleConfirmDelete() {
        await executeMutationUtil(deleteProductReviewMutation(currentBrand().id, productId, {id: id}))
        handleReload();
    }

    return (

        <>
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{localStrings.confirmMessage.deleteReview}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)} color="primary" autoFocus>
                        {localStrings.cancel}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary">
                        {localStrings.confirmAction}
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={updateReview}
                onClose={() => setConfirmDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {/*<DialogTitle id="alert-dialog-title">{localStrings.confirmMessage.deleteReview}</DialogTitle>*/}
                <DialogContent>
                    <ProductReview
                        productId={productId}
                        modeEdit={true}
                        updateValues={{
                            comment: comment,
                            stars: stars,
                            id: id,
                        }}
                        closeCallBack={() => {
                           setUpdateReview(false);
                        }}
                        updateCallBack={() => {
                            handleReload();
                        }}
                    />
                </DialogContent>

                {/*<DialogActions>*/}
                {/*    <Button onClick={() => setConfirmDelete(false)} color="primary" autoFocus>*/}
                {/*        {localStrings.cancel}*/}
                {/*    </Button>*/}
                {/*    <Button onClick={handleConfirmDelete} color="primary">*/}
                {/*        {localStrings.confirmAction}*/}
                {/*    </Button>*/}
                {/*</DialogActions>*/}
            </Dialog>

            <Box mb={4} maxWidth="600px">
                <FlexBox alignItems="center" mb={2}>
                    <BazarAvatar src={userIconUrl} height={48} width={48} />
                    <Box ml={2}>
                        {/*<p>{userId}</p>*/}
                        {/*<p>{dbUser?.id}</p>*/}
                        <H5 mb={0.5}>{userName}</H5>
                        <FlexBox alignItems="center">
                            <BazarRating value={stars} color="warn" readOnly />
                            <H6 mx={1.25}>{stars}</H6>
                            <Span>{getDateDifference(updateDate)}</Span>
                            {dbUser && dbUser.id === userId &&
                            <>
                                <Tooltip title={localStrings.deleteReview}>
                                    <IconButton onClick={() => setConfirmDelete(true)} sx={{marginLeft:1}}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={localStrings.editReview}>
                                    <IconButton sx={{marginLeft:1}} onClick={() => setUpdateReview(true)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                            }
                        </FlexBox>
                    </Box>
                </FlexBox>

                <Paragraph color="grey.700">{comment}</Paragraph>
            </Box>
        </>
    )
}

export default ProductComment
