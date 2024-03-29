import TableRow from '@component/TableRow'
import {H5} from '@component/Typography'
import {IconButton, Typography} from '@material-ui/core'
import East from '@material-ui/icons/East'
import Link from 'next/link'
import React from 'react'
import moment from "moment";
import {formatOrderConsumingModeGrid} from "../../util/displayUtil";
import localStrings from "../../localStrings";
import {
    ORDER_STATUS_COMPLETE,
    ORDER_STATUS_DELIVERING,
    ORDER_STATUS_FINISHED,
    ORDER_STATUS_NEW,
    ORDER_STATUS_PREPARATION
} from "../../util/constants";

export interface OrderRowProps {
  item: {
    orderNo: any
    status: string
    href: string
    purchaseDate: string | Date
    price: number
    currency: string
  }
  currency: string,
  language: string
}

const OrderRow: React.FC<OrderRowProps> = ({ item, currency, language }) => {
  const getColor = (status: string) => {
    switch (status) {
      case ORDER_STATUS_NEW:
        return 'secondary'
      case ORDER_STATUS_DELIVERING:
        return 'secondary'
      case ORDER_STATUS_PREPARATION:
        return 'secondary'
      case ORDER_STATUS_PREPARATION:
        return 'secondary'
      case ORDER_STATUS_FINISHED:
        return 'success'
      case ORDER_STATUS_COMPLETE:
        return 'success'
      // case 'Cancelled':
      //   return 'error'
      default:
        return ''
    }
  }

  return (
    <Link href={"/orders/" + item.id}>
      <a>
        <TableRow sx={{ my: '1rem', padding: '6px 18px' }}>
          <H5 m={0.75} textAlign="left">
            {item.orderNumber}
          </H5>

          <br/>
          <Typography className="pre" m={0.75} textAlign="left" sx={{width: 250}}>
            {formatOrderConsumingModeGrid(item, localStrings)}
          </Typography>
          <Typography className="pre" m={0.75} textAlign="left">
            {/*{item.creationDate}*/}
            {moment(parseFloat(item.creationDate)).locale(language).calendar()}
            {/*{format(new Date(item.creationDate), 'MMM dd, yyyy')}*/}
          </Typography>
          <Typography m={0.75} textAlign="left">
            {(item.totalPrice || 0).toFixed(2)} {currency}
          </Typography>

          <Typography
            textAlign="center"
            color="grey.600"
            sx={{
              flex: '0 0 0 !important',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <IconButton>
              <East fontSize="small" color="inherit" />
            </IconButton>
          </Typography>
        </TableRow>
      </a>
    </Link>
  )
}

export default OrderRow
