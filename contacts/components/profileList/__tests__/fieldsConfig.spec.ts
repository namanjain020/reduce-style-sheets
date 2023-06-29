//utils
import { getLayout } from '../fieldsConfig';

describe('fieldsConfig', () => {
  describe('getLayout', () => {
    test('should add `PROFILES` node in layout if `showProfileSelector` is true', () => {
      expect(getLayout({ showProfileSelector: true }).nodes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item: 'PROFILES',
          }),
        ])
      );
    });

    test('should not add `PROFILES` node in layout if `showProfileSelector` is false', () => {
      expect(getLayout({ showProfileSelector: false }).nodes).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item: 'PROFILES',
          }),
        ])
      );
    });
  });
});
