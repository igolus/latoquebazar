import FlexBox from '@component/FlexBox'
import { BoxProps } from '@material-ui/core'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { makeStyles } from '@material-ui/styles'
import { SxProps } from '@material-ui/system'
import React from 'react'

interface AccordionHeaderProps {
  showIcon?: boolean
  sx?: SxProps
  open?: boolean
  [key: string]: unknown
}

const useStyles = makeStyles(() => ({
  caretIcon: {
    transform: (props: any) => (props.open ? 'rotate(90deg)' : 'rotate(0deg)'),
    transition: 'transform 250ms ease-in-out',
  },
}))

const AccordionHeader: React.FC<AccordionHeaderProps & BoxProps> = ({
  children,
  showIcon,
  open,
  sx,
  ...props
}) => {
  const classes = useStyles({ open })

  return (
    <FlexBox sx={sx} alignItems="center" justifyContent="space-between" {...props}>
      {children}
      {showIcon && <ChevronRight className={classes.caretIcon} fontSize="small" />}
    </FlexBox>
  )
}

AccordionHeader.defaultProps = {
  showIcon: true,
  py: '0.5rem',
  px: '1rem',
}

export default AccordionHeader
