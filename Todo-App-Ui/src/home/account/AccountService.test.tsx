import Axios from "axios";
import AccountService from "./AccountService";

describe('AccountService tests', () => {
  let spyAxiosDelete: jest.SpyInstance;

  beforeEach(() => {
    spyAxiosDelete = jest.spyOn(Axios, 'delete');
  })

  afterEach(() => {
    spyAxiosDelete.mockRestore();
  })

  test('should call delete axios method', async () => {
    spyAxiosDelete.mockImplementation((id: string) => Promise.resolve());
    var result = await AccountService.deleteTodoAccount('NOT-AN-ACTUAL-USER-ID');
    expect(spyAxiosDelete).toHaveBeenCalledTimes(1);
  });
});
