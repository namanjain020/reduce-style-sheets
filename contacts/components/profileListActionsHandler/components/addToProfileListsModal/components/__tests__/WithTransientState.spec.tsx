//libs
import { render, screen } from '@testing-library/react';
import { ApolloError } from '@apollo/client';

//components
import { withTransientState } from '../withTransientState';

//types
import { ProfileList } from '@space/modules/profileList/types';

const Component = withTransientState(() => <div data-testid="wrapped-component">Component</div>);

describe('WithTransientState', () => {
  test('should render loader, if profile lists are being fetched', () => {
    render(<Component loading error={undefined} profileLists={undefined} refetch={() => null} />);

    expect(screen.getAllByTestId('content-loader')[0]).toBeInTheDocument();
  });

  test('should render error message, if an error has occurred while fetching profile lists', () => {
    render(
      <Component
        loading={false}
        error={{ message: 'An Error Occurred' } as unknown as ApolloError}
        profileLists={undefined}
        refetch={() => null}
      />
    );

    expect(screen.getByText('Oops! Faced an error.')).toBeInTheDocument();
  });

  test('should render no profile lists found message, if number of profile lists fetched are 0', () => {
    render(<Component loading={false} error={undefined} profileLists={[]} refetch={() => null} />);

    expect(screen.getByText('No Contact Lists found!')).toBeInTheDocument();
  });

  test('should render `WrappedComponent`, if at least one profile list has been fetched', () => {
    render(
      <Component loading={false} error={undefined} profileLists={[{} as unknown as ProfileList]} refetch={() => null} />
    );

    expect(screen.getByTestId('wrapped-component')).toBeTruthy();
  });
});
