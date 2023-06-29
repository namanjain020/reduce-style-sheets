//libs
import dynamic from 'next/dynamic';

//hocs
import { withLoadNamespaces } from '@sprinklr/modules/infra/hocs/withLoadNamespace';
import { wrapWithSuspense } from '@sprinklr/modules/infra/hocs/wrapWithSuspense';

//constants
import { ERROR_NAMESPACE } from '@sprinklr/modules/error/i18n';

const Placeholder = () => null;

const ProfileEditorModal = wrapWithSuspense(Placeholder)(
  dynamic(() => import(/* webpackChunkName: "profile-editor-modal" */ './ProfileEditorModal'), {
    loading: withLoadNamespaces(ERROR_NAMESPACE)(Placeholder),
  })
);

export { ProfileEditorModal };
