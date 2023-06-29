//lib
import { memo } from 'react';

//components
import { ProfileListEditor } from '../components/profileListEditor';

//hooks
import { useEditProfileList } from './hooks/useEditProfileList';
import { useFetchProfilesByProfileList } from '@/modules/contacts/components/profileListManager/hooks/useFetchProfilesByProfileList';

//type
import { ProfileListInfo } from '../types';

//i18n
import { useContactsTranslation } from '@/modules/contacts/i18n';

const EditProfileList = ({
  id,
  profileListInfo,
  onClose,
  onSuccess,
}: {
  id: string;
  profileListInfo: ProfileListInfo;
  onSuccess: () => void;
  onClose: () => void;
}): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const { profiles, loading: isFetchingProfiles } = useFetchProfilesByProfileList(id, onClose);

  const { editProfileList, loading: isEditingProfileList } = useEditProfileList({ id, profiles, onSuccess, onClose });

  return (
    <ProfileListEditor
      onClose={onClose}
      title={__contactsT('Edit Contact List')}
      onSave={editProfileList}
      profileListInfo={profileListInfo}
      loading={isFetchingProfiles}
      isSaving={isEditingProfileList}
      profiles={profiles}
    />
  );
};

const MemoEditProfileList = memo(EditProfileList);
export { MemoEditProfileList as EditProfileList };
