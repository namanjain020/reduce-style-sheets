//components
import { Box } from '@sprinklr/spaceweb/box';
import { PreviewCard } from '@/modules/contacts/components/PreviewCard';

//hocs
import { withTransientState } from './withTransientState';

//readers
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

//types
import { Profile } from '@/modules/contacts/types';

type Props = {
  profiles: Array<Profile>;
};

const PreviewCardsList = ({ profiles }: Props): Spr.Null<JSX.Element> =>
  profiles.length ? (
    <Box className="flex flex-col gap-4" $as="section">
      {profiles.map(
        (profile: Profile): JSX.Element => (
          <Box className="rounded-8 border-1 spr-border-03" key={AudienceProfileEntity.getId(profile)}>
            <PreviewCard profile={profile} />
          </Box>
        )
      )}
    </Box>
  ) : null;

export default withTransientState<Props>(PreviewCardsList);
