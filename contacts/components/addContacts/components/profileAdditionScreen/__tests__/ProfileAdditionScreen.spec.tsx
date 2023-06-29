//libs
import { render, screen } from '@testing-library/react';

//components
import { __testProfileAdditionScreen as ProfileAdditionScreen } from '../ProfileAdditionScreen';

//types
import { ContactScreenProps } from '../../types';

jest.mock('../variants/singleChannelProfileAddition', () => ({
  SingleChannelProfileAddition: () => <div data-testid="singleChannelProfileAddition" />,
}));

jest.mock('../variants/multiChannelsProfileAddition', () => ({
  MultiChannelsProfileAddition: () => <div data-testid="multiChannelsProfileAddition" />,
}));

const MOCK_PROPS = {} as unknown as ContactScreenProps;

describe('ProfileAdditionScreen', () => {
  test('should render `SingleChannelProfileAddition` if the user has selected only a single channel', () => {
    render(<ProfileAdditionScreen {...MOCK_PROPS} selectedChannels={['SMS']} />);

    expect(screen.getByTestId('singleChannelProfileAddition')).toBeInTheDocument();
  });

  test('should render `MultiChannelsProfileAddition` if the user has selected multiple channels', () => {
    render(<ProfileAdditionScreen {...MOCK_PROPS} selectedChannels={['SMS', 'EMAIL']} />);

    expect(screen.getByTestId('multiChannelsProfileAddition')).toBeInTheDocument();
  });
});
