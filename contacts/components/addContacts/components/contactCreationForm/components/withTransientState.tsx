//libs
import { ComponentType } from 'react';
import { ApolloError } from '@apollo/client';

//components
import { Placeholder } from './Placeholder';
import { ErrorScreen } from './ErrorScreen';

type Props<T> = Partial<T> & {
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  refetch: () => void;
};

export const withTransientState = <T extends object>(
  WrappedComponent: ComponentType<React.PropsWithChildren<T>>
): ComponentType<React.PropsWithChildren<Props<T>>> => {
  const WithTransientState = (props: Props<T>): JSX.Element => {
    const { loading, error, refetch, ...restProps } = props;

    if (loading) return <Placeholder />;

    if (error) {
      return <ErrorScreen refetch={refetch} />;
    }

    return <WrappedComponent {...(restProps as T)} />;
  };

  return WithTransientState;
};
