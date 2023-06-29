/**
 * Created by: Raj Meghpara
 * Date: 2022-01-11
 * Time: 11:34
 */

//lib
import { ReactNode, ReactElement } from 'react';
import dynamic from 'next/dynamic';

//types
import { ButtonActionProps } from '@sprinklr/modules/platform/types';

//components
import { ButtonActionsProvider as BaseButtonActionsProvider } from '@sprinklr/modules/platform/buttonActions';

export const BUTTON_ACTIONS = {
  OPEN_CONTACT_ADDITION_FORM: '@sprinklr/action/openContactAdditionForm',
  OPEN_CREATE_PROFILE_LIST_MODAL: '@sprinklr/action/openCreateProfileListModal',
  OPEN_EDIT_PROFILE_LIST_MODAL: '@sprinklr/action/openEditProfileListModal',
  OPEN_IMPORT_PROFILES_MODAL: '@sprinklr/action/openImportProfilesModal',
  OPEN_EXPORT_CONTACTS_MODAL: '@sprinklr/action/openExportContactsModal',
};

const ButtonActions: Spr.StringTMap<React.ComponentType<React.PropsWithChildren<ButtonActionProps>>> = {
  [BUTTON_ACTIONS.OPEN_CONTACT_ADDITION_FORM]: dynamic(() =>
    import(/* webpackChunkName: "open-contact-addition-form" */ './buttonActions/OpenContactAdditionForm').then(
      mod => mod.OpenContactAdditionForm
    )
  ),
  [BUTTON_ACTIONS.OPEN_CREATE_PROFILE_LIST_MODAL]: dynamic(() =>
    import(/* webpackChunkName: "open-create-profile-list-modal" */ './buttonActions/OpenCreateProfileListModal').then(
      mod => mod.OpenCreateProfileListModal
    )
  ),
  [BUTTON_ACTIONS.OPEN_EDIT_PROFILE_LIST_MODAL]: dynamic(() =>
    import(/* webpackChunkName: "open-edit-profile-list-modal" */ './buttonActions/OpenEditProfileListModal').then(
      mod => mod.OpenEditProfileListModal
    )
  ),
  [BUTTON_ACTIONS.OPEN_IMPORT_PROFILES_MODAL]: dynamic(() =>
    import(/* webpackChunkName: "open-import-profiles-modal" */ './buttonActions/OpenImportProfilesModal').then(
      mod => mod.OpenImportProfilesModal
    )
  ),
  [BUTTON_ACTIONS.OPEN_EXPORT_CONTACTS_MODAL]: dynamic(() =>
    import(/* webpackChunkName: "open-export-contacts-modal" */ './buttonActions/OpenExportContactsModal').then(
      mod => mod.OpenExportContactsModal
    )
  ),
};

export const ButtonActionsProvider = (props: { children?: ReactNode }): ReactElement => (
  <BaseButtonActionsProvider {...props} buttonActions={ButtonActions} />
);
