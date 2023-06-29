//helpers
import { getUpdatedSelectedChannels } from '../getUpdatedSelectedChannels';

describe('getUpdatedSelectedChannels', () => {
  test('should remove currently selected channelType from selectedChannels, if it is already present', () => {
    expect(
      getUpdatedSelectedChannels({
        channelType: 'SMS',
        selectedChannels: ['SMS', 'EMAIL'],
      })
    ).toEqual(['EMAIL']);
  });

  test('should return only currently selected channelType, if selectedChannels array is empty', () => {
    expect(
      getUpdatedSelectedChannels({
        channelType: 'SMS',
        selectedChannels: [],
      })
    ).toEqual(['SMS']);
  });

  test('should return selectedChannels along with currently selected channelType, if mergingAllowedChannels is not empty and contains all elements of selectedChannels', () => {
    expect(
      getUpdatedSelectedChannels({
        channelType: 'SMS',
        selectedChannels: ['EMAIL'],
      })
    ).toEqual(['EMAIL', 'SMS']);
  });
});
