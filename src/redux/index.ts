//configure redux store

import { createStore, applyMiddleware, compose } from 'redux';
import  ParentReducer  from './parentReducer';
import Thunk from 'redux-thunk';
//___________________________________________
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(ParentReducer, composeEnhancers(applyMiddleware(Thunk)));
export default store;