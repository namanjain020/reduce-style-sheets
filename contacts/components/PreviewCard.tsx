//libs
import { memo, useCallback, useState } from 'react';

//components
import "./package.scss"
import { Box } from '@sprinklr/spaceweb/box';
import { ChannelUserAvatar } from '@sprinklr/modules/infra/components/channelUserAvatar';
import { SocialProfileSwitcher } from '@/modules/contacts/components/profileCard/components/socialProfileSwitcher';
import { TruncateWithTooltip } from '@sprinklr/modules/self-serve/components/truncateWithTooltip';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useAdaptedSecureImageUrl } from '@/hooks/useAdaptedSecureImageUrl';

//utils
import { AudienceProfileEntity, SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';
import { getImageUrl } from '@sprinklr/modules/universalEntities/profile/helpers/getImageUrl';
import { getName } from '@sprinklr/modules/universalEntities/profile/helpers/getName';
import { getSocialProfileHandle } from '@sprinklr/modules/universalEntities/profile/helpers';

//types
import { Profile } from '@/modules/contacts/types';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

const LINE_HEIGHT = 2;

type Props = {
  profile: Profile;
};

const PreviewCard = ({ profile }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const socialProfiles = AudienceProfileEntity.getSocialProfiles(profile);

  const [selectedSocialProfile, setSelectedSocialProfile] = useState<SocialProfile>(socialProfiles[0]);

  const handleProfileSwitch = useCallback(
    (socialProfile: SocialProfile) => setSelectedSocialProfile(socialProfile),
    []
  );

  const adaptedProfileImgUrl = useAdaptedSecureImageUrl(getImageUrl(selectedSocialProfile));

  const name = getName(selectedSocialProfile);
  const userName = getSocialProfileHandle(selectedSocialProfile);
  const type = SocialProfileEntity.getSnType(selectedSocialProfile);
  const bio = SocialProfileEntity.getBio(selectedSocialProfile);

  return (
    <Box className="rounded-8 border-1 spr-border-03 px-3 py-1 pt-2 flex flex-row gap-2">
      <ChannelUserAvatar url={adaptedProfileImgUrl} username={name} snType={type} size="md" className="flex-none" />

      <Box className="flex-grow">
        <Box className="flex flex-row gap-1">
          <Box $as="span" className="font-600 spr-text-01 text-14">
            {name}
          </Box>

          <Box $as="span" className="text-12 font-500 spr-text-02">
            {userName}
          </Box>
        </Box>
        <TruncateWithTooltip maxHeight={1 * LINE_HEIGHT} className="text-12 font-400 spr-text-02 -mt-1">
          {bio || __contactsT('No Bio')}
        </TruncateWithTooltip>
      </Box>
      <Box className="self-center">
        <SocialProfileSwitcher
          socialProfile={selectedSocialProfile}
          socialProfiles={socialProfiles}
          onProfileSwitch={handleProfileSwitch}
        />
      </Box>
    </Box>
  );
};

const MemoizedPreviewCard = memo(PreviewCard);

export { MemoizedPreviewCard as PreviewCard };
