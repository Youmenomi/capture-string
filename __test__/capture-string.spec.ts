import { tests } from './helps';

describe('capture-string', () => {
  describe('capture string', () => {
    tests.c.forEach((t) => {
      it(t.name, () => {
        expect(t.process()).toStrictEqual(t.result);
      });
    });
  });
  describe('capture with Captured', () => {
    tests.cwc.forEach((t) => {
      it(t.name, () => {
        expect(t.process()).toStrictEqual(t.result);
      });
    });
  });
  describe('delete capture string', () => {
    tests.d.forEach((t) => {
      it(t.name, () => {
        expect(encodeURI(t.process())).toStrictEqual(t.result);
      });
    });
  });
});
