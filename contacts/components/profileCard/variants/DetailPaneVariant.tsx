//libs
import { memo, ReactElement, useCallback } from 'react';

//components
import { ProfileCardRightSection } from '../components/ProfileCardRightSection';
import { ProfileImage } from '../components/ProfileImage';
import { SocialProfileSwitcher } from '../components/socialProfileSwitcher';
import { ProfileCardLayout, SLOT_NAMES } from '../components/profileCardLayout';

//utils/entities
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';
import { getSocialProfileEntityId } from '@/modules/contacts/utils/getSocialProfileEntityId';

//constants
import moduleTypes from '@/constants/moduleTypes';

//hooks
import { useThirdPane } from '@/hooks/useThirdPane';

//types
import { Profile } from '@/modules/contacts/types';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

export type Props = {
  profile: Profile;
  socialProfile: SocialProfile;
};

const DetailPaneVariant = ({ profile, socialProfile }: Props): ReactElement => {
  const socialProfiles = AudienceProfileEntity.getSocialProfiles(profile);

  const { openThirdPane } = useThirdPane();

  const handleProfileSwitch = useCallback<(nextSelectedSocialProfile: SocialProfile) => void>(
    nextSelectedSocialProfile => {
      const socialProfileEntityId = getSocialProfileEntityId(profile, nextSelectedSocialProfile);

      if (socialProfileEntityId) {
        openThirdPane(moduleTypes.PROFILE, socialProfileEntityId);
      }
    },
    [openThirdPane, profile]
  );

  return (
    <ProfileCardLayout>
      <ProfileCardLayout.Slot name={SLOT_NAMES.LEFT_SECTION}>
        <ProfileImage socialProfile={socialProfile} />

        <SocialProfileSwitcher
          socialProfile={socialProfile}
          socialProfiles={socialProfiles}
          onProfileSwitch={handleProfileSwitch}
        />
      </ProfileCardLayout.Slot>

      <ProfileCardLayout.Slot name={SLOT_NAMES.RIGHT_SECTION}>
        <ProfileCardRightSection profile={profile} socialProfile={socialProfile} />
      </ProfileCardLayout.Slot>
    </ProfileCardLayout>
  );
};

const MemoizedDetailPaneVariant = memo(DetailPaneVariant);

export { MemoizedDetailPaneVariant as DetailPaneVariant };
