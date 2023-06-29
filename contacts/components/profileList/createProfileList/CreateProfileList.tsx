//lib
import { memo } from 'react';

//components
import { ProfileListEditor } from '../components/profileListEditor';

//hooks
import { useCreateProfileList } from './hooks/useCreateProfileList';

//i18n
import { useContactsTranslation } from '@/modules/contacts/i18n';

//types
import { ProfileList } from '@space/modules/profileList/types';

export type Props = {
  onHide: () => void;
  onSuccess: (profileList: ProfileList) => void;
  showProfileSelector?: boolean;
};

const CreateProfileList = ({ onHide, onSuccess, showProfileSelector = true }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const { createProfileList, loading } = useCreateProfileList({ onSuccess });

  return (
    <ProfileListEditor
      onClose={onHide}
      title={__contactsT('Create New Contact List')}
      onSave={createProfileList}
      isSaving={loading}
      showProfileSelector={showProfileSelector}
    />
  );
};

export default memo(CreateProfileList);
