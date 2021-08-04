import {executeMutationUtil} from "../apolloClient/gqlUtil";
import {addNotification} from "../gql/notificationGql";

export async function sendNotif(brandId, establishmentId, type, link, senderId) {
  await executeMutationUtil(addNotification(brandId, {
    type: type,
    link: link,
    establishmentId: establishmentId,
    senderId: senderId,
  }))
}
