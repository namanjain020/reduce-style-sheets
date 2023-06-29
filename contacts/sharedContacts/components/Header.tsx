//libs
import { memo, useCallback, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';

//components
import { AddContactButton } from '@/modules/contacts/components/AddContactButton';
import MoreActionsButton from '@/modules/contacts/components/MoreActionsButton';
import { EntityFilters } from '@/components/entityFilters';
import { PageHeader, SLOT_NAMES } from '@/components/pageHeader';

//constants
import AppVariables from '../../../src/assets/appVariables.scss';
import { CONTACTS_TYPES } from '@/modules/contacts/constants';
import { searchQueryVar, sortDetailsVar } from '@/modules/contacts/sharedContacts/reactiveVariables';

//utils
import { getMediaQueries } from '@/modules/responsive/utils';
import { getSortOptions } from '@/modules/contacts/utils/getSortOptions';

//i18n
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

//hooks
import useMenuConfig from '@/modules/navigation/hooks/useMenuConfig';
import { useContactsTabs } from '@/modules/contacts/hooks/useContactsTabs';

type Props = {
  filterRenderer: () => JSX.Element;
  isSticky: boolean;
};

const Header = (props: Props): JSX.Element => {
  const { filterRenderer, isSticky } = props;

  const searchQuery = useReactiveVar(searchQueryVar);
  const sortDetails = useReactiveVar(sortDetailsVar);

  const handleSearch = useCallback((newSearchQuery: string) => searchQueryVar(newSearchQuery), []);
  const handleSort = useCallback((newSortDetails: any) => sortDetailsVar(newSortDetails), []);

  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();
  const { tabsMap } = useContactsTabs();

  const {
    currentMenu: { name },
  } = useMenuConfig();

  const sortOptions = useMemo(() => getSortOptions(__commonT), [__commonT]);

  const title = tabsMap[CONTACTS_TYPES.SHARED_CONTACTS]?.label;
  return (
    <PageHeader
      id="contacts-page"
      isSticky={isSticky}
      styles={[
        getMediaQueries('width', [
          `calc(${AppVariables.engagementCardWidth} + ${AppVariables.actionPanelWidth} + ${AppVariables.actionPanelPadding})`,
          AppVariables.engagementCardWidth,
        ]),
      ]}
      title={name}
    >
      {!isSticky ? (
        <PageHeader.Slot name={SLOT_NAMES.CTA}>
          <AddContactButton />
        </PageHeader.Slot>
      ) : null}

      {!isSticky ? (
        <PageHeader.Slot name={SLOT_NAMES.ACTION}>
          <MoreActionsButton />
        </PageHeader.Slot>
      ) : null}

      <PageHeader.Slot name={SLOT_NAMES.ENTITY_FILTERS}>
        <EntityFilters
          isSticky={isSticky}
          searchPlaceholder={__contactsT('Search {{title}}...', { title })}
          onSearch={handleSearch}
          searchKeyword={searchQuery}
          onSort={handleSort}
          renderFilter={filterRenderer}
          sortOptions={sortOptions}
          sortDetails={sortDetails}
        />
      </PageHeader.Slot>
    </PageHeader>
  );
};

export default memo(Header);
