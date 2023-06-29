//libs
import { ChangeEvent, memo, useCallback } from 'react';

//components
import { Radio, RadioGroup } from '@sprinklr/spaceweb/radio';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//constants
import { PROFILE_ADDITION_MODES } from './constants';

type Props = {
  mode: keyof typeof PROFILE_ADDITION_MODES;
  onModeChange: (mode: Props['mode']) => void;
  singleModeRadioLabel?: string;
  bulkModeRadioLabel?: string;
};

const ProfileAdditionModeSelector = ({
  mode,
  onModeChange,
  singleModeRadioLabel: _singleModeRadioLabel,
  bulkModeRadioLabel: _bulkModeRadioLabel,
}: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const singleModeRadioLabel = _singleModeRadioLabel ?? __contactsT('Add Single Contact');
  const bulkModeRadioLabel = _bulkModeRadioLabel ?? __contactsT('Add Contacts in Bulk');

  const handleModeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onModeChange(e.target.value as Props['mode']),
    [onModeChange]
  );

  return (
    <RadioGroup value={mode} size="lg" intent="default" onChange={handleModeChange} name="number" align="horizontal">
      <Radio value={PROFILE_ADDITION_MODES.SINGLE} data-testId="singleProfileAdditionModeSelector">
        {singleModeRadioLabel}
      </Radio>
      <Radio value={PROFILE_ADDITION_MODES.BULK} data-testid="bulkProfileAdditionModeSelector">
        {bulkModeRadioLabel}
      </Radio>
    </RadioGroup>
  );
};

const MemoizedProfileAdditionModeSelector = memo(ProfileAdditionModeSelector);

export { MemoizedProfileAdditionModeSelector as ProfileAdditionModeSelector };
