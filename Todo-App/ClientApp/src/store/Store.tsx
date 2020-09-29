import {
  configureStore,
  EnhancedStore,
  createReducer,
  ActionReducerMapBuilder,
  AnyAction,
} from '@reduxjs/toolkit';
import {RootState, rootReducer} from '../reducers/RootReducer';
import {createEpicMiddleware} from 'redux-observable';

export default class Store {

  private static _instance: Store;
  private _store: EnhancedStore<RootState, AnyAction>;
  private _injectReducer:
    (callback: (bldr: ActionReducerMapBuilder<any>) => ActionReducerMapBuilder<any>) => void;

  // This class generates a singleton redux store instance
  // It's possible to create many stores with redux.
  private constructor() {
    const epicMiddleware = createEpicMiddleware();
    this._store = configureStore({
      reducer: rootReducer,
      middleware: [epicMiddleware], // configureStore will automatically pass those to applyMiddleware.
      devTools: true
    });

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

