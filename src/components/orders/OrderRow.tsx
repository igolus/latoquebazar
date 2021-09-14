import TableRow from '@component/TableRow'
import { H5 } from '@component/Typography'
import { Chip, IconButton, Typography } from '@material-ui/core'
import East from '@material-ui/icons/East'
import { Box } from '@material-ui/system'
import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'
import moment from "moment";
import {
  formatOrderConsumingMode,
  formatOrderConsumingModeGrid,
  formatOrderStatus,
  formatOrderStatusGrid
} from "../../util/displayUtil";
import localStrings from "../../localStrings";
import {
  ORDER_STATUS_DELIVERING, ORDER_STATUS_FINISHED,
  ORDER_STATUS_NEW,
  ORDER_STATUS_PREPARATION,
  ORDER_STATUS_READY
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
}

const OrderRow: React.FC<OrderRowProps> = ({ item, currency }) => {
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
          <Box m={0.75} width={"25px"}>
            <Chip
              size="small"
              label={formatOrderStatus(item.status, localStrings)}
              sx={{
                p: '0.25rem 0.5rem',
                fontSize: 12,
                color: !!getColor(item.status)
                  ? `${getColor(item.status)}.900`
                  : 'inherit',
                backgroundColor: !!getColor(item.status)
                  ? `${getColor(item.status)}.100`
                  : 'none',
              }}
            />
          </Box>
          <Typography className="pre" m={0.75} textAlign="left">
            {formatOrderConsumingModeGrid(item, localStrings)}
          </Typography>
          <Typography className="pre" m={0.75} textAlign="left">
            {/*{item.creationDate}*/}
            {moment(parseFloat(item.creationDate)).locale("fr").calendar()}
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
