/* Created by Gaurav on 04/05/22 */

//hooks
import { useAclStorePermission } from '@/hooks/useAclStorePermission';
import { useFeatureUtils } from '@/contexts/featureUtils/useFeatureUtils';

//constants
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';
import SN_TYPES from '@sprinklr/modules/infra/constants/snTypes';

const useIsProfileListManagerEnabled = (): boolean => {
  const isProfileListViewEnabled = useAclStorePermission('p:profile_list:view');
  const featureUtils = useFeatureUtils();

  const contactEnabledChannels =
    featureUtils.getValueOrFunction('DISTRIBUTED_CONTACT_ENABLED_CHANNELS', 'D') ?? EMPTY_ARRAY_READONLY;
  const isEmailChannelEnabled = contactEnabledChannels.includes(SN_TYPES.EMAIL.type);

  return isProfileListViewEnabled && isEmailChannelEnabled;
};

export { useIsProfileListManagerEnabled };
