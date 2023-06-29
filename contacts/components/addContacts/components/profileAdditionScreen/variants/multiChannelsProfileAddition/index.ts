//libs
import dynamic from 'next/dynamic';

//components
import { Placeholder } from './components/Placeholder';

//hocs
import { withLoadNamespaces } from '@sprinklr/modules/infra/hocs/withLoadNamespace';
import { wrapWithSuspense } from '@sprinklr/modules/infra/hocs/wrapWithSuspense';

//constants
import { ERROR_NAMESPACE } from '@sprinklr/modules/error/i18n';

const MultiChannelsProfileAddition = wrapWithSuspense(Placeholder)(
  dynamic(() => import(/* webpackChunkName: "multi-channels-profile-addition" */ './MultiChannelsProfileAddition'), {
    loading: withLoadNamespaces(ERROR_NAMESPACE)(Placeholder),
  })
);

export { MultiChannelsProfileAddition };
