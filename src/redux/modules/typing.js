import { createAction, handleActions } from "redux-actions";
import { produce } from 'immer';

const DIVIDE_PARAGRAPH = 'DIVIDE_PARAGRAPH';
const SET_CURRENT_DIVIDED = 'SET_CURRENT_DIVIDED'

const divideParagraph = createAction(DIVIDE_PARAGRAPH, (paragraph_height)=>({paragraph_height}));
const setCurrentDivided = createAction(SET_CURRENT_DIVIDED, (current_divided)=>({current_divided}));

const initialState = {
    divided_num: [],
    current_divided: 0,
}

export default handleActions({
    [DIVIDE_PARAGRAPH]:(state, action) => produce(state, (draft) => {
        draft.divided_num = action.payload.paragraph_height.map(a=>{
            if(a % 210 === 0){
                return a / 210
            } else return Math.ceil(a / 210);
        })
    }),
    [SET_CURRENT_DIVIDED]:(state, action) => produce(state, (draft) => {
        draft.current_divided = action.payload.current_divided;
    })
}, initialState);

const actionCreators = {
    divideParagraph,
    setCurrentDivided,
}

export {actionCreators};