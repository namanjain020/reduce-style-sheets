//libs
import { render, screen } from '@testing-library/react';
import { ApolloError } from '@apollo/client';

//components
import { withTransientState } from '../withTransientState';

const Component = withTransientState(() => <div data-testid="wrapped-component">Component</div>);

describe('WithTransientState', () => {
  test('should render `Placeholder` when `loading` is true', () => {
    render(<Component loading refetch={() => null} error={undefined} />);

    expect(screen.getByTestId('contactCreationFormPlaceholder')).toBeInTheDocument();
  });

  test('should render `ErrorScreen` when `loading` is false and `error` is non-empty', () => {
    render(
      <Component
        loading={false}
        error={{ message: 'An Error Occurred' } as unknown as ApolloError}
        refetch={() => null}
      />
    );

    expect(screen.getByTestId('empty_screen_contactCreationFormError')).toBeInTheDocument();
  });

  test('should render `WrappedComponent` when `loading` is false and `error` is `undefined`', () => {
    render(<Component loading={false} error={undefined} refetch={() => null} />);

    expect(screen.getByTestId('wrapped-component')).toBeInTheDocument();
  });
});
