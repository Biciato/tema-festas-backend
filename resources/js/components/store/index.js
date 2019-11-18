import { createStore } from 'redux';
import { orders } from '../reducers';

export const Store = createStore(orders);