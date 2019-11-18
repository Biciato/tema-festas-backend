import { ADD_ORDER } from '../actions/actions'

export const orders = (state = [], action, order) => {
    switch (action.type) {
        case ADD_ORDER:
            return [
                ...state,
                order
            ]
        default:
            return state
    }
}

