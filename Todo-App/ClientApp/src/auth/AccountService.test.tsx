import Axios from 'axios';
import {AccountService} from './AccountService';

describe('Account Service', () => {

  let axiosPostSpy: jest.SpyInstance<any>;
  let axiosDeleteSpy: jest.SpyInstance<any>;

  beforeEach(() => {
    axiosPostSpy = jest.spyOn(Axios, 'post');
    axiosDeleteSpy = jest.spyOn(Axios, 'delete');
  });

  afterEach(() => {
    axiosPostSpy.mockReset();
    axiosDeleteSpy.mockReset();
  });

  test('should call Axios.post and return a void promise', () => {
    const mockUserObj = {};
    // here the mocked implementation is sucessfull <-- doesn't throw anything
    axiosPostSpy.mockImplementation(() => new Promise<void>(() => {}));
    const postPromise = AccountService.registerUser(mockUserObj);
    const isPromise = Promise.resolve(postPromise) === postPromise;
    expect(isPromise).toBe(true);
    expect(axiosPostSpy).toHaveBeenCalledTimes(1);
  });

  test('should call Axios.delete and return a void promise', () => {
    const mockUserName = '';
    axiosDeleteSpy.mockImplementation(() => new Promise<void>(() => {}));
    const deletePromise = AccountService.deleteUser(mockUserName);
    const isPromise = Promise.resolve(deletePromise) === deletePromise;
    expect(isPromise).toBe(true);
    expect(axiosDeleteSpy).toHaveBeenCalledTimes(1);
  });
});

