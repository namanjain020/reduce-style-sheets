//util
import { splitProfileEntityId } from '../splitProfileEntityId';

describe('splitProfileEntityId', () => {
  test('should return separated audienceProfileId, snType and snUserId from profileEntityId', () => {
    expect(splitProfileEntityId('645632572aaaa12~1', '~')).toEqual({
      audienceProfileId: '645632572aaaa12',
      socialProfileIndex: '1',
    });
  });
});
