//libs
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

//components
import { PreviewCard } from '../PreviewCard';

//types
import { Profile } from '@/modules/contacts/types';

const MOCK_PROFILE = {
  id: 'MOCK_TEST_ID',
  __typename: 'AudienceProfile',
  socialProfiles: [
    {
      name: 'MOCK_NAME',
      username: 'MOCK_USER_NAME',
      snType: 'CHANNEL',
    },
    {
      name: 'MOCK_NAME2',
      username: 'MOCK_USER_NAME2',
      snType: 'CHANNEL2',
    },
  ],
} as unknown as Profile;

jest.mock('@/hooks/useAdaptedSecureImageUrl', () => ({
  useAdaptedSecureImageUrl: x => x,
}));

describe('PreviewCard', () => {
  it('should render name and username', () => {
    render(<PreviewCard profile={MOCK_PROFILE} />);

    expect(screen.getByText('MOCK_USER_NAME')).toBeInTheDocument();
    expect(screen.getByText('MOCK_NAME')).toBeInTheDocument();
  });
  it('should render name and username of 2nd social profile, when profile switcher is clicked', () => {
    render(<PreviewCard profile={MOCK_PROFILE} />);

    userEvent.click(screen.getByTestId('profile-switcher'));

    expect(screen.getByText('MOCK_NAME2')).toBeInTheDocument();
    expect(screen.getByText('MOCK_USER_NAME2')).toBeInTheDocument();
  });
});
