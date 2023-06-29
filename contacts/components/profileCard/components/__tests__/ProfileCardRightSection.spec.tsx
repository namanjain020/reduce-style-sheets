//libs
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

//providers
import { MockI18nProvider } from '@sprinklr/modules/infra/tests/MockI18nProvider';

//components
import { ProfileCardRightSection } from '../ProfileCardRightSection';

//types
import { Profile } from '@/modules/contacts/types';

const MOCK_SOCIAL_PROFILE_1 = {
    snId: '12334',
    name: 'Sprinklr',
    username: 'sprinklr',
    bio: 'Hello there',
    link: 'www.sprinklr.com',
    snType: 'TWITTER',
  },
  MOCK_SOCIAL_PROFILE_2 = {
    snId: '9923',
    name: 'Sprinklr',
    username: 'sprinklr',
    bio: null,
    link: 'www.sprinklr.com',
    snType: 'EMAIL',
  },
  MOCK_SOCIAL_PROFILE_3 = {
    snId: '9923',
    name: 'Sprinklr',
    username: 'sprinklr',
    bio: null,
    link: 'www.sprinklr.com',
    snType: 'LINKEDIN',
  },
  MOCK_AUDIENCE_PROFILE = {
    id: '7735',
    profileWorkflowProperties: {
      tags: [
        {
          tagName: 'mountain',
          iconUrl: 'mountaing.com',
        },
      ],
    },
    socialProfiles: [MOCK_SOCIAL_PROFILE_1, MOCK_SOCIAL_PROFILE_2, MOCK_SOCIAL_PROFILE_3],
  } as unknown as Profile;

describe('ProfileCardRightSection', () => {
  test('should render name, userName, bio and profile stats when all information is available and social profile channel is not `LINKEDIN`', () => {
    render(
      <MockI18nProvider>
        <ProfileCardRightSection
          profile={MOCK_AUDIENCE_PROFILE}
          socialProfile={MOCK_AUDIENCE_PROFILE.socialProfiles[0]}
        />
      </MockI18nProvider>
    );
    expect(screen.getByText('Sprinklr')).toBeInTheDocument();
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    expect(screen.getByText('@sprinklr')).toBeInTheDocument();
    expect(screen.getByTestId('profile-stats')).toBeInTheDocument();
  });

  test('should render `No Bio` when bio field is undefined', () => {
    render(
      <MockI18nProvider>
        <ProfileCardRightSection
          profile={MOCK_AUDIENCE_PROFILE}
          socialProfile={MOCK_AUDIENCE_PROFILE.socialProfiles[1]}
        />
      </MockI18nProvider>
    );
    expect(screen.getByText('No Bio')).toBeInTheDocument();
  });

  test('should not render `profile-stats` when social profile channel is `LINKEDIN`', () => {
    render(
      <MockI18nProvider>
        <ProfileCardRightSection
          profile={MOCK_AUDIENCE_PROFILE}
          socialProfile={MOCK_AUDIENCE_PROFILE.socialProfiles[2]}
        />
      </MockI18nProvider>
    );

    expect(screen.queryByTestId('profile-stats')).toBeNull();
  });
});
