//libs
import { useMemo } from 'react';
import _reduce from 'lodash/reduce';

//constants
import { GET_CONTACT_CHANNELS_DATA_QUERY } from '@/modules/contacts/queries';

//constants
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';

//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

const useFetchChannelsAllowedToBeMerged = (): {
  loading: boolean;
  channelsAllowedToBeMerged: Array<SnType>;
} => {
  const { data, loading } = useQuery(GET_CONTACT_CHANNELS_DATA_QUERY);

  const contactChannelsData = data?.dstGetContactChannels ?? EMPTY_OBJECT_READONLY;

  const channelsAllowedToBeMerged = useMemo(
    () =>
      _reduce(
        contactChannelsData,
        (
          _channelsAllowedToBeMerged: Array<SnType>,
          { mergingAllowedChannels }: { mergingAllowedChannels: Array<SnType> },
          channel: SnType
        ) => (mergingAllowedChannels.length ? [..._channelsAllowedToBeMerged, channel] : _channelsAllowedToBeMerged),
        []
      ),
    [contactChannelsData]
  );

  return { loading, channelsAllowedToBeMerged };
};

export { useFetchChannelsAllowedToBeMerged };
