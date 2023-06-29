/**
 * Created by: Raj Meghpara
 * Date: 2021-07-26
 * Time: 19:16
 */

//libs
import { useCallback, memo, Fragment } from 'react';
import _isEmpty from 'lodash/isEmpty';

//components
import { ModalBody, ModalFooter, ModalHeader } from '@sprinklr/spaceweb/modal';
import Button from '@/components/button';
import { Placeholder } from './components/Placeholder';
import { ChannelSelector } from './components/channelSelector';
import { Menu, MenuItem } from '@sprinklr/spaceweb/menu';
import { ErrorScreen } from './components/ErrorScreen';
import CssTransition from '@space/core/components/cssTransition';

//constants
import { ACTION_TYPES } from '../../constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

//types
import { ContactScreenProps } from '../types';
import { ChannelData } from '../../types';

//i18n
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

const ProfileChannelsSelector = ({
  channelsData,
  loading,
  selectedChannels,
  onAction,
  error,
  refetchChannelsData,
}: ContactScreenProps): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  const goToNextScreen = useCallback(() => {
    onAction({ type: ACTION_TYPES.GO_TO_NEXT_SCREEN, payload: EMPTY_OBJECT_READONLY });
  }, [onAction]);

  if (error) {
    return <ErrorScreen refetch={refetchChannelsData} />;
  }

  return loading ? (
    <Placeholder />
  ) : (
    <>
      <ModalHeader className="text-20">{__contactsT('Select Channel')}</ModalHeader>

      <ModalBody>
        <CssTransition appear>
          <Menu $as="section" className="pt-2 px-0">
            {channelsData.map(
              (channelData: ChannelData, index: number): JSX.Element => (
                <Fragment key={channelData.id}>
                  <MenuItem className="p-0 my-0 rounded-0">
                    <ChannelSelector
                      channelData={channelData}
                      selectedChannels={selectedChannels}
                      onAction={onAction}
                    />
                  </MenuItem>

                  {index !== channelsData.length - 1 ? <hr className="my-1 mx-6" /> : null}
                </Fragment>
              )
            )}
          </Menu>
        </CssTransition>
      </ModalBody>

      <ModalFooter className="p-6">
        <Button
          size="md"
          onClick={goToNextScreen}
          disabled={_isEmpty(selectedChannels)}
          data-testid="channelSelectorNextButton"
        >
          {__commonT('Next')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default memo(ProfileChannelsSelector);
