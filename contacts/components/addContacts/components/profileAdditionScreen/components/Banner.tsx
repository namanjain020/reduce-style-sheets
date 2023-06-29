//components
import { Banner as SpacewebBanner, BannerProps } from '@sprinklr/spaceweb/banner';
import CssTransition from '@space/core/components/cssTransition';

//constants
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

const BANNER_OVERRIDES = {
  HeaderIcon: {
    style: 'mt-1 self-start',
  },
};

export const Banner = ({
  bannerProps: { title, intent } = EMPTY_OBJECT_READONLY,
}: {
  bannerProps?: BannerProps;
}): JSX.Element => (
  <CssTransition appear>
    <SpacewebBanner title={title} intent={intent} className="flex-none" overrides={BANNER_OVERRIDES} />
  </CssTransition>
);
