//lib
import { memo, ReactElement, useState, useCallback, SyntheticEvent } from 'react';
import update from 'immutability-helper';
import _isEmpty from 'lodash/isEmpty';

//components
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@sprinklr/spaceweb/modal';
import { Box } from '@sprinklr/spaceweb/box';
import Button from '@/components/button';
import { StickyContainer, StickyItem } from '@sprinklr/modules/infra/components/sticky';
import { Search } from '@sprinklr/spaceweb/search';
import { ProfileLists } from './components/ProfileLists';
import { IconTextButton } from '@sprinklr/modules/infra/components/interactiveAtoms/IconTextButton';

//icons
import AddIcon from '@sprinklr/spaceweb-icons/solid/Add';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';
import { useFetchProfileLists } from './hooks/useFetchProfileLists';

//constants
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';
import { ITEM_WIDTH } from './constants';
import { PROFILE_LIST_ACTIONS } from '../../constants';

//types
import { ProfileList } from '@space/modules/profileList/types';
import type { OnProfileListAction } from '../../hooks/useProfileListActionsHandler';

const DEBOUNCE_INTERVAL = 300;
const MODAL_HEIGHT = 50;
const MODAL_WIDTH = 52;
const MODAL_OVERRIDES = {
  Dialog: { style: { height: `${MODAL_HEIGHT}rem`, width: `${MODAL_WIDTH}rem` } },
};
const OVERRIDES = {
  BaseButton: {
    style: [
      ({ theme }) => ({
        color: theme.spr.text04,
      }),
    ],
  },
};

const IconRenderer = (): ReactElement => <AddIcon className="spr-icon-04" />;

export type Props = {
  onHide: () => void;
  onAction: OnProfileListAction;
  profileListIds?: Array<string>;
  handleAddition: ({
    successCallback,
    errorCallback,
    contactListIds,
  }: {
    successCallback: () => void;
    errorCallback: () => void;
    contactListIds: Array<string>;
  }) => void;
};

const AddToProfileListsModal = ({
  onHide,
  onAction,
  profileListIds = EMPTY_ARRAY_READONLY,
  handleAddition,
}: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  const [selectedProfileListIds, setSelectedProfileListIds] = useState<Array<string>>(profileListIds);

  const [additionInProgress, setAdditionInProgress] = useState<boolean>(false);

  const {
    loading: isLoadingProfileLists,
    error,
    data,
    fetchMore,
    isPaginating,
    refetch,
  } = useFetchProfileLists({
    searchQuery: debouncedSearchQuery,
  });
  const [scrollContainerEl, setScrollContainerEl] = useState<Spr.Null<HTMLElement>>(null);

  const handleSearchQueryChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => setSearchQuery((e.target as HTMLInputElement).value),
    []
  );

  const handleDebouncedSearchQueryChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => setDebouncedSearchQuery((e.target as HTMLInputElement).value),
    []
  );

  const handleProfileListChange = useCallback(
    (profileList: ProfileList) =>
      setSelectedProfileListIds((prevSelectedProfileListIds: string[]) => {
        const id = String(profileList.id);

        const index = prevSelectedProfileListIds.indexOf(id);

        return index === -1
          ? update(prevSelectedProfileListIds, { $push: [id] })
          : update(prevSelectedProfileListIds, { $splice: [[index, 1]] });
      }),
    []
  );

  const handleOpenCreateNewProfileListModal = useCallback(
    () =>
      onAction({
        type: PROFILE_LIST_ACTIONS.OPEN_CREATE_PROFILE_LIST_MODAL,
        payload: {
          onHide: () =>
            onAction({
              type: PROFILE_LIST_ACTIONS.OPEN_ADD_TO_PROFILE_LISTS_MODAL,
              payload: {
                profileListIds: selectedProfileListIds,
              },
            }),

          onSuccess: (newProfileList: ProfileList) => {
            onAction({
              type: PROFILE_LIST_ACTIONS.OPEN_ADD_TO_PROFILE_LISTS_MODAL,
              payload: {
                profileListIds: [...selectedProfileListIds, String(newProfileList.id)],
              },
            });
          },
        },
      }),
    [onAction, selectedProfileListIds]
  );

  const handleBulkAdditionToProfileLists = useCallback(() => {
    setAdditionInProgress(true);

    handleAddition({
      contactListIds: selectedProfileListIds,
      successCallback: () => setAdditionInProgress(false),
      errorCallback: () => setAdditionInProgress(false),
    });
  }, [handleAddition, selectedProfileListIds]);

  return (
    <Modal isOpen onClose={onHide} overrides={MODAL_OVERRIDES} animate={false}>
      <ModalHeader className="py-5">{__contactsT('Add to Contact Lists')}</ModalHeader>

      <ModalBody className="w-full">
        <StickyContainer className="flex flex-col border-0 h-full w-full pb-4" ref={setScrollContainerEl}>
          <StickyItem
            id="search-sticky-header"
            stuckClassName="spr-shadow-05"
            className="spr-ui-01 z-50 py-4 px-6 w-full"
          >
            <Box className={['flex flex-row gap-2 items-center', { width: `${ITEM_WIDTH}px` }]}>
              <Search
                value={searchQuery}
                onChange={handleSearchQueryChange}
                debouncedOnChange={handleDebouncedSearchQueryChange}
                placeholder={__contactsT('Search')}
                debounceInterval={DEBOUNCE_INTERVAL}
              />
            </Box>
          </StickyItem>

          <Box className="flex-1 px-6">
            <ProfileLists
              selectedProfileListIds={selectedProfileListIds}
              onProfileListChange={handleProfileListChange}
              profileLists={data?.searchResults}
              loading={isLoadingProfileLists}
              error={error}
              refetch={refetch}
              hasMore={data?.hasMore}
              fetchMore={fetchMore}
              scrollContainerEl={scrollContainerEl}
              isPaginating={isPaginating}
            />
          </Box>
        </StickyContainer>
      </ModalBody>

      <ModalFooter className="p-3 flex flex-row justify-between">
        <IconTextButton
          icon={IconRenderer}
          size="sm"
          onClick={handleOpenCreateNewProfileListModal}
          overrides={OVERRIDES}
          trackerEventId="@/contacts/addToProfileListsModal/CreateNewContactListButton"
        >
          {__contactsT('New Contact List')}
        </IconTextButton>

        <Box className="flex flex-row gap-3">
          <Button onClick={onHide} variant="secondary">
            {__commonT('Cancel')}
          </Button>

          <Button
            onClick={handleBulkAdditionToProfileLists}
            disabled={!!error || _isEmpty(selectedProfileListIds)}
            isLoading={additionInProgress || isLoadingProfileLists}
          >
            {__contactsT('Apply')}
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default memo(AddToProfileListsModal);
