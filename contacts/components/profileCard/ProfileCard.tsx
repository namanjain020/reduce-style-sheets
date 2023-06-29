//components
import { Props as DetailPaneVariantProps, DetailPaneVariant } from './variants/DetailPaneVariant';
import { Props as ListVariantProps, ListVariant } from './variants/ListVariant';

//constants
import { PROFILE_CARD_VARIANTS } from './constants';

type Props =
  | (DetailPaneVariantProps & { variant: PROFILE_CARD_VARIANTS.DETAIL_PANE })
  | (ListVariantProps & { variant: PROFILE_CARD_VARIANTS.LIST });

const ProfileCard = (props: Props): JSX.Element => {
  if (props.variant === PROFILE_CARD_VARIANTS.DETAIL_PANE) {
    return <DetailPaneVariant {...props} />;
  }

  return <ListVariant {...props} />;
};

export { ProfileCard };
