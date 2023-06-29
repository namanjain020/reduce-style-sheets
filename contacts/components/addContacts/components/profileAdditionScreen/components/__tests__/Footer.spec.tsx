//libs
import { render, screen, fireEvent } from '@testing-library/react';

//components
import { Footer } from '../Footer';

describe('Footer', () => {
  test('should not call `onClick` upon clicking "Add Contact" button when `isLoading` is `true`', () => {
    const onClick = jest.fn();

    const primaryButtonParams = {
      label: 'Add Contact',
      onClick,
      isLoading: true,
    };

    render(<Footer primaryButtonParams={primaryButtonParams} onAction={() => null} />);

    expect(fireEvent.click(screen.getByText('Add Contact')));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('should not call `onClick` upon clicking "Add Contact" button when `disabled` is `true`', () => {
    const onClick = jest.fn();

    const primaryButtonParams = {
      label: 'Add Contact',
      onClick,
      disabled: true,
    };

    render(<Footer primaryButtonParams={primaryButtonParams} onAction={() => null} />);

    expect(fireEvent.click(screen.getByText('Add Contact')));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('should call `onClick` upon clicking "Add Contact" button when `isLoading` and `disabled` are `false`', () => {
    const onClick = jest.fn();

    const primaryButtonParams = {
      label: 'Add Contact',
      onClick,
    };

    render(<Footer primaryButtonParams={primaryButtonParams} onAction={() => null} />);

    expect(fireEvent.click(screen.getByText('Add Contact')));
    expect(onClick).toHaveBeenCalled();
  });
});
