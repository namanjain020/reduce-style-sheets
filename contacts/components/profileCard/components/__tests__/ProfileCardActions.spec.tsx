//libs
import { render, screen } from '@testing-library/react';

//components
import { ProfileCardActions } from '../ProfileCardActions';

const MOCK_ACTIONS = [
  {
    action: 'REPLY',
    name: 'Message',
    icon: 'reply',
  },
  { action: 'DELETE', name: 'Remove Contact', icon: 'trash' },
];

describe('ProfileCardActions', () => {
  test('should render placeholder if actions are loading', () => {
    //@ts-ignore
    render(<ProfileCardActions onAction={() => null} actionItems={{}} loading />);

    expect(screen.queryByTestId('profileCardFooter')).toBeDefined();
    expect(screen.queryByTestId('messageActionsPlaceholder')).toBeDefined();
    expect(screen.queryByTestId('actionButton')).toBeNull();
  });

  test('should render actions when actions are loaded', () => {
    //@ts-ignore
    render(<ProfileCardActions onAction={() => null} actionItems={{ actions: MOCK_ACTIONS }} loading={false} />);

    expect(screen.queryByTestId('profileCardFooter')).toBeDefined();
    expect(screen.queryByTestId('messageActionsPlaceholder')).toBeNull();
    expect(screen.queryByTestId('actionButton')).toBeDefined();
  });

  test('should not render footer when actions have loaded and are empty', () => {
    //@ts-ignore
    render(<ProfileCardActions onAction={() => null} actionItems={{ actions: [] }} loading={false} />);

    expect(screen.queryByTestId('profileCardFooter')).toBeNull();
    expect(screen.queryByTestId('messageActionsPlaceholder')).toBeNull();
    expect(screen.queryByTestId('actionButton')).toBeNull();
  });
});
