import {compose, display, spacing, styled} from '@material-ui/system'
import 'lazysizes';

const BazarImage = styled('img')(compose(spacing, display))

BazarImage.defaultProps = {
  display: 'block',
  className: 'lazyload',
}

export default BazarImage

// compose,
// borders,
// display,
// flexbox,
// palette,
// positions,
// shadows,
// sizing,
// spacing,
// typography
