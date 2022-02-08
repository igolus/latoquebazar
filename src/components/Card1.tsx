import { Card } from '@material-ui/core'
import { styled } from '@material-ui/styles'

const Card1 = styled(Card)({
  position: 'relative',
  padding: '1rem 1rem',
  ['@media only screen and (max-width: 678px)']: {
    padding: '1rem',
  },
})

export default Card1
