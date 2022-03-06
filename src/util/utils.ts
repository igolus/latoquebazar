import { differenceInMinutes } from 'date-fns'
import ceil from 'lodash/ceil'
import moment from "moment";

export const getDateDifference = (date: string | number | Date) => {
  let dateMoment = moment(parseFloat(date))
  let dateNew = dateMoment.toDate();

  let diff = differenceInMinutes(new Date(), new Date(dateNew))
  if (diff < 60) return diff + ' minutes ago'

  diff = ceil(diff / 60)
  if (diff < 24) return `${diff} hour${diff === 0 ? '' : 's'} ago`

  diff = ceil(diff / 24)
  if (diff < 30) return `${diff} day${diff === 0 ? '' : 's'} ago`

  diff = ceil(diff / 30)
  if (diff < 12) return `${diff} month${diff === 0 ? '' : 's'} ago`

  diff = diff / 12
  return `${diff.toFixed(1)} year${ceil(diff) === 0 ? '' : 's'} ago`
}
