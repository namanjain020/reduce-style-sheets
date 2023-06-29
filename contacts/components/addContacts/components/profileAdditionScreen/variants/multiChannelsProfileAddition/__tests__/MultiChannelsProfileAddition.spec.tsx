//libs
import { render, screen, fireEvent, act } from '@testing-library/react';

//components
import MultiChannelsProfileAddition from '../MultiChannelsProfileAddition';

jest.mock(
  '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/bulkProfilesAddition',
  () => ({
    BulkProfilesAddition: ({ setProfileAdditionMode }) => (
      <div>
        <button type="button" onClick={() => setProfileAdditionMode('SINGLE')}>
          Switch Mode
        </button>
        <div data-testid="BulkProfilesAddition" />
      </div>
    ),
  })
);

jest.mock(
  '@/modules/contacts/components/addContacts/components/profileAdditionScreen/variants/multiChannelsProfileAddition/components/profileAdditionForm',
  () => ({
    ProfileAdditionForm: ({ setProfileAdditionMode }) => (
      <div>
        <button type="button" onClick={() => setProfileAdditionMode('BULK')}>
          Switch Mode
        </button>
        <div data-testid="ProfileAdditionForm" />
      </div>
    ),
  })
);

describe('MultiChannelsProfileAddition', () => {
  test('should render `ProfileAdditionForm` upon initial mount', () => {
    render(
      <MultiChannelsProfileAddition
        selectedChannels={[]}
        onAction={() => null}
        addContactInProgress={false}
        channelInputValues={{}}
        onClose={() => null}
      />
    );

    expect(screen.getByTestId('ProfileAdditionForm')).toBeInTheDocument();
  });

  test('should render `BulkProfilesAddition` when user switches mode', () => {
    render(
      <MultiChannelsProfileAddition
        selectedChannels={[]}
        onAction={() => null}
        addContactInProgress={false}
        channelInputValues={{}}
        onClose={() => null}
      />
    );

    act(() => {
      fireEvent.click(screen.getByText('Switch Mode'));
    });

    expect(screen.getByTestId('BulkProfilesAddition')).toBeInTheDocument();
  });
});
