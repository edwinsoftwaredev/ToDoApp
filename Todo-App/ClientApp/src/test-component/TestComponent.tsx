import React, {useEffect} from 'react';
import {createSlice, PayloadAction, createSelector, Action} from '@reduxjs/toolkit';
import {RootState} from '../reducers/RootReducer';
import {useSelector, useDispatch} from 'react-redux';
import {StateObservable, ActionsObservable, ofType} from 'redux-observable';
import {map} from 'rxjs/operators';

// HERE IT IS DETAILED, THROUGH CODE, HOW REDUX-OBSERVABLES(EPICS)
// ARE IMPLEMENTED

export const testSlice = createSlice({
  name: 'testSlice',
  initialState: 0,
  reducers: {
    setValue: (state: number, action: PayloadAction<number>) => {
      return state + action.payload;
    }
  }
});

export const {setValue} = testSlice.actions;

//////////////////////////////////////////////////////////////////////////////////////////////

enum ActionTypes {
  SET_VALUE = 'testSlice/setValue'
};

const doSetValue = (value: number) => ({type: ActionTypes.SET_VALUE, payload: value});

interface ISetValue extends Action {
  type: ActionTypes.SET_VALUE,
  value: number
}

export const valueEpic = (
  action$: ActionsObservable<ISetValue>,
  state$: StateObservable<RootState>
) => action$.pipe(
  ofType<ISetValue>(ActionTypes.SET_VALUE),
  map((value: ISetValue) => {
    state$.value.testState = value.value
  })
);

export type TestComponentActions = ISetValue;

//////////////////////////////////////////////////////////////////////////////////////////////

const stateSelector = createSelector(
  (state: RootState) => state.testState,
  (testState: number) => testState
);

export const TestComponent: React.FC = () => {
  const value = useSelector(stateSelector);
  const dispatch = useDispatch();

  // const [val, setVal] = useState(value);

  const incrementEachSecond = () => {
    setInterval(() => {
      dispatch(doSetValue(value + 1));
    }, 1000);
  };

  const handleClick = () => {
    incrementEachSecond();
  };

  useEffect(() => {
    // setVal(value);
    /**
     * to get values programmatically or save a state
     * the code must be placed in useEffect.
     * 'value': is a variable which value is return by useSelector(React-Redux)
     * when 'value' changes use effect will trigger any code related to 'value'
     */
    console.log(value);
  }, [value])

  return (
    <div>
      <h1>{value}</h1>
      <button onClick={event => handleClick()}>
        Click Here To Win!
      </button>
    </div>
  );
}
