// libraries
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// components
import Input from '../Input';

// providers
import { MockI18nProvider } from '@sprinklr/modules/infra/tests/MockI18nProvider';

describe('Input', () => {
  test('should not call `onAction` when `channelInputValues` is empty', () => {
    const mockOnAction = jest.fn();

    render(<Input channels={['TWITTER']} onAction={mockOnAction} channelInputValues={{}} />, {
      wrapper: MockI18nProvider,
    });

    userEvent.type(screen.getByPlaceholderText('Add Twitter Profile Handle'), 'something');

    expect(mockOnAction).not.toHaveBeenCalled();
  });

  test('should not call `onAction` when `action.type` is not `FORM_CHANGE_ACTION`', () => {
    const mockOnAction = jest.fn();

    render(<Input channels={['TWITTER']} onAction={mockOnAction} channelInputValues={{ TWITTER: 'someone' }} />, {
      wrapper: MockI18nProvider,
    });

    expect(mockOnAction).not.toHaveBeenCalled();
  });

  test('should call `onAction` when `action.type` is `FORM_CHANGE_ACTION` and `channelInputValues` is not empty', () => {
    const mockOnAction = jest.fn();

    render(<Input channels={['TWITTER']} onAction={mockOnAction} channelInputValues={{ TWITTER: 'someone' }} />, {
      wrapper: MockI18nProvider,
    });

    userEvent.type(screen.getByPlaceholderText('Add Twitter Profile Handle'), 'something');

    expect(mockOnAction).toHaveBeenCalledWith({
      type: 'CHANGE_CHANNEL_INPUT_VALUES',
      payload: {
        channelInputValues: {},
      },
    });
  });
});
