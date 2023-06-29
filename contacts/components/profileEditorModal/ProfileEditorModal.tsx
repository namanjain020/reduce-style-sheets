//lib
import { memo, useCallback, useMemo, useEffect } from 'react';

//components
import Button from '@/components/button';
import { Form, useForm } from '@sprinklr/spaceweb-form';
import { Modal, ModalHeader, ModalFooter, ModalBody } from '@sprinklr/spaceweb/modal';
import { Placeholder } from './components/Placeholder';
import { ErrorScreen } from './components/ErrorScreen';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';
import { useErrorTranslation } from '@sprinklr/modules/error/i18n';
import { useUpdateProfile } from './hooks/useUpdateProfile';
import { useFetchUpdateAllowedChannels } from '@/modules/contacts/hooks/useFetchUpdateAllowedChannels';

//utils
import { validate } from 'spr-validation-schema/lib/validate';
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/AudienceProfileEntity';
import { SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/SocialProfileEntity';
import { getSocialProfileEntityId as getFieldKeyFromSocialProfile } from '@sprinklr/modules/universalEntities/profile/helpers/general';

//constants
import { getLayout, getValidationSchema, getFieldConfigMap, getInitialValues } from './formConfig';

//types
import { AudienceProfile, SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';
import { ProfileCreationRequest } from '@/modules/contacts/components/addContacts/hooks/useCreateContact/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

const MODAL_HEIGHT = 60;
const MODAL_OVERRIDES = {
  Dialog: {
    style: { height: `${MODAL_HEIGHT}rem` },
  },
};

export type Props = {
  onHide: () => void;
  profile: AudienceProfile;
};

const ProfileEditorModal = ({ onHide, profile }: Props): Spr.Null<JSX.Element> => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();
  const { __errorT } = useErrorTranslation();

  const {
    channelsAllowedToUpdate,
    loading: isFetchingUpdateAllowedChannels,
    error: fetchUpdateAllowedChannelsError,
    refetch,
  } = useFetchUpdateAllowedChannels();

  const [updateProfile, { loading: isEditingProfile }] = useUpdateProfile({ onSuccessCallback: onHide });

  const initialFieldConfigMap = useMemo(
    () => getFieldConfigMap({ __contactsT, profile, channelsAllowedToUpdate }),
    [__contactsT, channelsAllowedToUpdate, profile]
  );

  const initialValues = useMemo(() => getInitialValues(profile), [profile]);

  const initialLayout = useMemo(() => getLayout({ __contactsT, profile }), [__contactsT, profile]);

  const validationSchema = useMemo(() => getValidationSchema({ __errorT, profile }), [__errorT, profile]);

  const onSubmit = useCallback(
    ({ values }: { values: Spr.StringStringMap }) => {
      const editableSocialProfiles: Array<SocialProfile> = AudienceProfileEntity.getSocialProfiles(profile).filter(
        (socialProfile: SocialProfile) =>
          !!channelsAllowedToUpdate?.includes(SocialProfileEntity.getSnType(socialProfile))
      );

      const socialProfilesMetadata = editableSocialProfiles.reduce(
        (acc: Required<ProfileCreationRequest>['socialProfilesMetadata'], socialProfile: SocialProfile) => {
          const updatedSnId = values[getFieldKeyFromSocialProfile(socialProfile)!];

          if (updatedSnId) {
            acc.push({
              snType: SocialProfileEntity.getSnType(socialProfile) as SnType,
              snId: updatedSnId,
            });
          }

          return acc;
        },
        []
      );

      updateProfile({
        variables: {
          profileId: String(AudienceProfileEntity.getId(profile)),
          profileCreationRequest: {
            profileAttributes: {
              firstName: values.firstName,
              lastName: values.lastName,
            },
            socialProfilesMetadata,
          },
        },
      });
    },
    [channelsAllowedToUpdate, profile, updateProfile]
  );

  const { errors, values, handleSubmit, layout, fieldConfigMap, handleAction, reset } = useForm({
    initialValues,
    onSubmit,
    initialLayout,
    initialFieldConfigMap,
    validate: ({ values: valuesToValidate }) => validate(valuesToValidate, validationSchema),
  });

  useEffect(() => {
    reset({ fieldConfigMap: initialFieldConfigMap });
  }, [initialFieldConfigMap, reset]);

  const renderBody = useCallback(() => {
    if (isFetchingUpdateAllowedChannels) {
      return <Placeholder />;
    }

    if (fetchUpdateAllowedChannelsError) {
      return <ErrorScreen refetch={refetch} />;
    }

    return (
      <Form
        className="mb-3"
        layout={layout}
        fieldConfigMap={fieldConfigMap}
        values={values}
        errors={errors}
        onAction={handleAction}
      />
    );
  }, [
    fetchUpdateAllowedChannelsError,
    errors,
    fieldConfigMap,
    handleAction,
    isFetchingUpdateAllowedChannels,
    layout,
    refetch,
    values,
  ]);

  return (
    <Modal isOpen onClose={onHide} size="md" overrides={MODAL_OVERRIDES}>
      <ModalHeader>{__contactsT('Edit Contact')}</ModalHeader>

      <ModalBody className="flex flex-col gap-4 px-6 py-4" data-testid="profileEditorBody">
        {renderBody()}
      </ModalBody>

      <ModalFooter className="p-6 flex flex-row justify-end gap-3">
        <Button onClick={onHide} variant="secondary">
          {__commonT('Cancel')}
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!!fetchUpdateAllowedChannelsError}
          isLoading={isEditingProfile || isFetchingUpdateAllowedChannels}
        >
          {__contactsT('Submit')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default memo(ProfileEditorModal);
