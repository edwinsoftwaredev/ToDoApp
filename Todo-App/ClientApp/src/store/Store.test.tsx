import Store from "./Store";

describe('Store service', () => {

  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('should return the same instance', () => {
    const storeInstance1 = Store.getInstance();
    const storeInstance2 = Store.getInstance();

    expect(storeInstance1).toBe(storeInstance2);
  });
});
