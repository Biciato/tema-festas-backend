export const ADD_ORDER = 'ADD_ORDER';

export const REMOVE_ORDER = 'REMOVE_ORDER';

export const addOrder = order => ({ type: ADD_ORDER, order });

export const removeOrder = order => ({ type: REMOVE_ORDER, order });