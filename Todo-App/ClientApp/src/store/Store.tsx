import {
  configureStore,
  createSlice,
  Slice,
  EnhancedStore,
  createReducer,
  ActionReducerMapBuilder,
  AnyAction
} from '@reduxjs/toolkit';

export default class Store {

  private static _instance: Store;
  private _store: EnhancedStore<RootState, AnyAction>;
  private _injectReducer:
    (callback: (bldr: ActionReducerMapBuilder<any>) => ActionReducerMapBuilder<any>) => void;

  // This class generates a singleton redux store instance
  // It's possible to create many stores with redux.
  private constructor() {

    const initialSlice: Slice<RootState> = createSlice({
      name: 'app',
      initialState: {
        appName: 'TodoApp',
      } as RootState,
      reducers: {
        // no reducers
      }
    });

    this._store = configureStore(initialSlice);

    this._injectReducer =
      (callback: (bldr: ActionReducerMapBuilder<any>) => ActionReducerMapBuilder<any>) => {
        return this._store.replaceReducer(
          createReducer(this._store.getState(), builder => callback(builder))
        );
      };
  }

  get ARInjector():
    (callback: (bldr: ActionReducerMapBuilder<any>) => ActionReducerMapBuilder<any>) => void {
    return this._injectReducer;
  }

  public static getInstance(): EnhancedStore<RootState, AnyAction> {
    if (!Store._instance) {
      Store._instance = new Store();
    }

    return Store._instance._store;
  }
}

export interface RootState {
  appName: string;
}