import { tests } from './helps';

describe('capture-string', () => {
  describe('capture string', () => {
    tests.c.forEach((t) => {
      it(t.name, () => {
        expect(t.process()).toStrictEqual(t.result);
      });
    });
  });
  describe('capture with capture', () => {
    tests.cwc.forEach((t) => {
      it(t.name, () => {
        expect(t.process()).toStrictEqual(t.result);
      });
    });
  });
});
