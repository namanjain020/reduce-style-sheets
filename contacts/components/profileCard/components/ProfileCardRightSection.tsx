/**
 * Created by: Raj Meghpara
 * Date: 2021-08-11
 * Time: 20:51
 */

//libs
import { ReactElement, memo, SyntheticEvent } from 'react';

//components
import { Box } from '@sprinklr/spaceweb/box';
import { Stack, StackItem } from '@sprinklr/spaceweb/stack';
import ProfileTags, { Tag } from '@/components/engagementEntity/components/profileTags';
import { Link } from '@sprinklr/spaceweb/link';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//utils
import { numFormatter } from '@sprinklr/modules/infra/utils/formatters/numFormatter';
import { getName } from '@sprinklr/modules/universalEntities/profile/helpers/getName';

//constants
import snTypes from '@sprinklr/modules/infra/constants/snTypes';

//types
import { getSocialProfileHandle } from '@sprinklr/modules/universalEntities/profile/helpers';
import { AudienceProfileEntity, SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';
import { Profile } from '@/modules/contacts/types';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

type Props = {
  profile: Profile;
  socialProfile: SocialProfile;
};

const ProfileStat = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}): ReactElement => (
  <Box $as="span" className={['spr-text-02 mr-5 text-14', className]}>
    <Box $as="span" className="spr-text-01 mr-1 font-500 text-14 leading-7">
      {numFormatter(Number(value))}
    </Box>
    {label}
  </Box>
);

const PROFILE_HANDLE_CLASSNAME = 'text-14 font-400 spr-text-02 leading-8 min-w-0 truncate flex-none';

const stopPropagation = (event: SyntheticEvent): void => {
  event.stopPropagation();
};

const ProfileCardRightSection = memo(({ profile, socialProfile }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const userName = getSocialProfileHandle(socialProfile);
  const bio = SocialProfileEntity.getBio(socialProfile);
  const name = getName(socialProfile);
  const url = SocialProfileEntity.getUrl(socialProfile);
  const snType = SocialProfileEntity.getSnType(socialProfile);
  const followers = SocialProfileEntity.getFollowersCount(socialProfile);
  const following = SocialProfileEntity.getFollowingCount(socialProfile);
  const statusCount = SocialProfileEntity.getStatusCount(socialProfile);
  const tags = AudienceProfileEntity.getProfileTags(profile) as Array<Tag>;

  return (
    <Box className="flex-grow flex flex-col">
      <Box className="flex flex-col flex-grow">
        <Stack direction="horizontal" gap={1} className="items-center w-full min-w-0 truncate">
          <StackItem shrink className="min-w-0">
            <Box
              $as="span"
              className="font-600 spr-text-01 inline-block text-20 leading-10 w-full min-w-0 truncate overflow-hidden"
            >
              {name}
            </Box>
          </StackItem>
          <ProfileTags tags={tags} />
        </Stack>

        {url ? (
          <Link
            className={[
              PROFILE_HANDLE_CLASSNAME,
              ({ theme }) => ({
                ':hover': { color: theme.spr.text02 },
                ':visited': { color: theme.spr.text02 },
              }),
            ]}
            href={url}
            onClick={stopPropagation}
            target="_blank"
          >
            {userName}
          </Link>
        ) : (
          <Box $as="span" className={PROFILE_HANDLE_CLASSNAME}>
            {userName}
          </Box>
        )}

        <Box
          $as="span"
          className={[
            'text-14 font-400 spr-text-02 inline-block min-w-0 truncate leading-8 flex-grow',
            bio ? '' : 'italic',
          ]}
        >
          {bio || __contactsT('No Bio')}
        </Box>
      </Box>

      {snType !== snTypes.LINKEDIN.type ? (
        <Box className="mt-3 mb-4 min-w-0 truncate flex-none text-14" data-testid="profile-stats">
          <ProfileStat label={__contactsT('Followers')} value={followers} />
          <ProfileStat label={__contactsT('Following')} value={following} />
          <ProfileStat label={__contactsT('Posts')} value={statusCount} className="mr-0" />
        </Box>
      ) : null}
    </Box>
  );
});

export { ProfileCardRightSection };
