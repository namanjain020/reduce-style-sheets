/**
 * Created by: Raj Meghpara
 * Date: 2021-08-06
 * Time: 14:33
 */

//libs
import { memo } from 'react';
import dynamic from 'next/dynamic';

//hooks
import { useContactCreationFields } from './hooks/useContactCreationFields';

//components
import { Placeholder } from './components/Placeholder';

//types
import { ContactScreenProps } from '../types';

const ContactCreationFormComponent = dynamic(
  () => import(/* webpackChunkName: "contact-creation-form" */ './ContactCreationForm'),
  { loading: Placeholder }
);

const ContactCreationForm = ({
  onAction,
  channelInputValues,
  selectedChannels,
  onClose,
}: Pick<ContactScreenProps, 'onAction' | 'channelInputValues' | 'selectedChannels' | 'onClose'>): JSX.Element => {
  const { data: fields, error, refetch, loading } = useContactCreationFields(selectedChannels);

  return (
    <ContactCreationFormComponent
      onAction={onAction}
      channelInputValues={channelInputValues}
      fields={fields}
      onClose={onClose}
      loading={loading}
      error={error}
      refetch={refetch}
    />
  );
};

const MemoizedContactCreationForm = memo(ContactCreationForm);

export { MemoizedContactCreationForm as ContactCreationForm };
