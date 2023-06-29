//libs
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import _noop from 'lodash/noop';
import { ApolloError } from '@apollo/client';

//components
import ProfileChannelsSelector from '../ProfileChannelsSelector';

//provider
import { MockI18nProvider } from '@sprinklr/modules/infra/tests/MockI18nProvider';

//types
import { ContactScreenProps } from '../../types';

jest.mock('../components/Placeholder', () => ({
  __esModules: true,
  Placeholder: () => <div data-testid="placeholder">Placeholder</div>,
}));

jest.mock('../components/ErrorScreen', () => ({
  __esModules: true,
  ErrorScreen: () => <div data-testid="error-screen">ErrorScreen</div>,
}));

describe('ProfileChannelsSelector', () => {
  test('should render Placeholder if loading is true', () => {
    const props = {
      channelsData: [],
      loading: true,
      selectedChannels: [],
      onAction: _noop,
      error: undefined,
      refetchChannelsData: _noop,
    } as unknown as ContactScreenProps;

    render(
      <MockI18nProvider>
        <ProfileChannelsSelector {...props} />
      </MockI18nProvider>
    );

    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });

  test('should render ErrorScreen when error occurs in fetching channelsData', () => {
    const props = {
      channelsData: [],
      loading: true,
      selectedChannels: [],
      onAction: _noop,
      error: new ApolloError({ errorMessage: 'An error occurred' }),
      refetchChannelsData: _noop,
    } as unknown as ContactScreenProps;

    render(
      <MockI18nProvider>
        <ProfileChannelsSelector {...props} />
      </MockI18nProvider>
    );

    expect(screen.getByTestId('error-screen')).toBeInTheDocument();
  });

  test('should render all channelTypes present in channelsData when loading is false and error is undefined', () => {
    const props = {
      channelsData: [
        { mergingAllowedChannels: ['SMS'], id: 'EMAIL' },
        { mergingAllowedChannels: [], id: 'TWITTER' },
        { mergingAllowedChannels: ['EMAIL'], id: 'SMS' },
      ],
      loading: false,
      selectedChannels: ['SMS'],
      onAction: _noop,
      error: undefined,
      refetchChannelsData: _noop,
    } as unknown as ContactScreenProps;

    render(
      <MockI18nProvider>
        <ProfileChannelsSelector {...props} />
      </MockI18nProvider>
    );

    expect(screen.getByTestId('SMS-selector')).toBeInTheDocument();
    expect(screen.getByTestId('EMAIL-selector')).toBeInTheDocument();
    expect(screen.getByTestId('TWITTER-selector')).toBeInTheDocument();
  });
});
