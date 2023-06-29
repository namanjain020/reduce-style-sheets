//lib
import { memo, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import _uniqBy from 'lodash/uniqBy';

//components
import { Box } from '@sprinklr/spaceweb/box';
import { Avatar } from '@sprinklr/modules/infra/components/avatar';
import { AsyncSelect, Option } from '@sprinklr/spaceweb/asyncSelect';
import { AsyncSelectInput, Props } from '@sprinklr/modules/platform/form/fieldRenderers/AsyncSelectInput';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//queries
import { DST_ALL_CONTACTS } from '@/modules/contacts/queries';

//utils
import { AudienceProfileEntity, SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';
import { getProfileOptions } from '../../utils';

//constants
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

//types
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';

const getValueLabel = ({ option }: { option: Option }): JSX.Element => (
  <Box className="flex flex-row items-center">
    <Avatar name={option.name} size="sm" src={option.imageUrl} className="mr-2 flex-none" />
    <Box className="flex-1 font-500 text-13">{option.name}</Box>
  </Box>
);

const getOptionLabel = ({ option = EMPTY_OBJECT_READONLY }: { option?: Spr.Undefined<Option> }): JSX.Element => (
  <Box className="flex flex-row items-center">
    <Avatar name={option.name} size="sm" src={option.imageUrl} className="mr-3 flex-none" />
    <Box className="flex-1 font-400 text-14">{option.name}</Box>
  </Box>
);

const DEFAULT_PAGE_SIZE = 20;
const OVERRIDES = {
  Select: AsyncSelect,
} as Props['overrides'];

const ProfileSelector = ({
  value,
  onAction,
  id,
  selectedProfiles,
  size,
}: {
  selectedProfiles: Array<AudienceProfile>;
  value: Option[];
  onAction: (action: Spr.Action) => void;
  id: string;
  size: Props['size'];
}): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const { refetch: fetchMyContacts } = useQuery(DST_ALL_CONTACTS, {
    skip: true,
  });

  const loadOptions = useCallback(
    (query: string, pageNumber: number): Promise<{ options: Array<Option>; complete: boolean }> =>
      fetchMyContacts({
        searchRequest: {
          query,
          start: DEFAULT_PAGE_SIZE * pageNumber,
          rows: DEFAULT_PAGE_SIZE,
        },
      }).then(({ data }) => ({
        options: getProfileOptions(
          data.dstAllContacts.profiles ?? (EMPTY_ARRAY_READONLY as unknown as Array<AudienceProfile>)
        ),
        complete: !data.dstAllContacts.hasMore,
      })),
    [fetchMyContacts]
  );

  const initialOptions = useMemo(() => getProfileOptions(selectedProfiles), [selectedProfiles]);
  const filterOptions = useCallback(
    (options: Array<Option>): Array<Option> => _uniqBy([...initialOptions, ...options], 'id'),
    [initialOptions]
  );

  return (
    <AsyncSelectInput
      loadOnMount
      loadOptions={loadOptions}
      filterOptions={filterOptions}
      initialOptions={initialOptions}
      getValueLabel={getValueLabel}
      getOptionLabel={getOptionLabel}
      id={id}
      //@ts-ignore it is expecting string[] but value can be Option[]
      value={value}
      multi
      size={size}
      label={__contactsT('Select Profiles')}
      placeholder={__contactsT('Select Profiles')}
      debounceInterval={200}
      onAction={onAction}
      isOptionRequiredOnChange
      filterOutSelected={false}
      overrides={OVERRIDES}
    />
  );
};

const memoProfileSelector = memo(ProfileSelector);
export { memoProfileSelector as ProfileSelector };
