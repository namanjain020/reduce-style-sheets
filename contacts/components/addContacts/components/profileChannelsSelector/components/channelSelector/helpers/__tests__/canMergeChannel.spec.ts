//helpers
import { canMergeChannels } from '../canMergeChannel';

describe('canMergeChannels', () => {
  test('should return true if channelsWithMergePermission is not empty and includes all selectedChannels', () => {
    expect(
      canMergeChannels({
        selectedChannels: ['EMAIL'],
        channelsWithMergePermission: ['EMAIL', 'WHATSAPP_BUSINESS'],
      })
    ).toEqual(true);
  });

  test('should return false if channelsWithMergePermission does not contains all elements of selectedChannels', () => {
    expect(
      canMergeChannels({
        selectedChannels: ['EMAIL'],
        channelsWithMergePermission: ['TWITTER'],
      })
    ).toEqual(false);
  });
});
