import TableRow from '@component/TableRow'
import { H5 } from '@component/Typography'
import { Chip, IconButton, Typography } from '@material-ui/core'
import East from '@material-ui/icons/East'
import { Box } from '@material-ui/system'
import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'
import moment from "moment";
import {formatOrderStatus} from "../../util/displayUtil";
import localStrings from "../../localStrings";

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
      case 'Pending':
        return 'secondary'
      case 'Processing':
        return 'secondary'
      case 'Delivered':
        return 'success'
      case 'Cancelled':
        return 'error'
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
          <Box m={0.75}>
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
            {moment.unix(item.creationDate).locale("fr").calendar()}
            {/*{format(new Date(item.creationDate), 'MMM dd, yyyy')}*/}
          </Typography>
          <Typography m={0.75} textAlign="left">
            {item.totalPrice.toFixed(2)} {currency}
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
