import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as scriptActions } from '../redux/modules/script';
import { actionCreators as userActions } from '../redux/modules/user';
import { alertNew } from '../shared/alert';

const Bookmark = (props) => {

    const [bookmark_on, setBookmarkOn] = useState(false);
        
    const is_login = useSelector(state => state.user.is_login);
    const bookmark_data = useSelector(state => state.script.bookmark);
    // const script_id = useSelector(state => state.script.typing_script?.scriptId);
    const dispatch = useDispatch();

    // 상세페이지에서 데이터가져오기
    useEffect(()=>{
        if(props.detail)
        dispatch(scriptActions.getMyScript(false));
        if(is_login && props.script_id && props.detail){
            dispatch(scriptActions.getMyScriptDB(props.script_id));
        }
    },[is_login, props.script_id])

    const addBookmark = (e) => {
      e.stopPropagation();
      if(!is_login){
        alertNew('로그인 후에 이용할 수 있습니다.', ()=>{dispatch(userActions.setLoginModal(true))});
      } else if(is_login){
        if(props.detail){
          dispatch(scriptActions.addMyScriptDB(props.script_id, true));
        }else{
          dispatch(scriptActions.addMyScriptDB(props.script_id, false));
        }
      }
    }

    const deleteBookmark = (e) => {
      e.stopPropagation();
      if(!is_login){
        alertNew('로그인 후에 이용할 수 있습니다.', ()=>{dispatch(userActions.setLoginModal(true))});
      } else if(is_login){
        if(props.detail){
          dispatch(scriptActions.deleteMyScriptDB(props.script_id, true));
        }else{
          dispatch(scriptActions.deleteMyScriptDB(props.script_id, false));
        }
      }
    }
    
    useEffect(()=>{
      console.log(props.bookmark);
    },[props.bookmark])

    return (
        <>
            <BookMarkButton on={props.bookmark ? (props.bookmark.length === 1 && true) : (bookmark_data && true)} 
            onClick={props.bookmark ? (props.bookmark.length === 1 ? deleteBookmark : addBookmark) : (bookmark_data ? deleteBookmark : addBookmark)}>
              <div className='bookmark-innershadow'></div>
              <svg
                width='27'
                height='35'
                viewBox='0 0 27 35'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M23 0H3.83333C1.725 0 0 1.725 0 3.83333V34.5L13.4167 28.75L26.8333 34.5V3.83333C26.8333 1.725 25.1083 0 23 0Z'
                />
              </svg>
            </BookMarkButton>
        </>
    );
};

const BookMarkButton = styled.div`
    position: absolute;
    top: -0.89vw;
    right: 1.56vw;
    height: min-content;
    cursor: pointer;

    svg {
      fill: ${props => props.on ? '#FF2E00' : '#d8d8d8'};
      transition: 0.3s;
      width: 1.41vw;
      height: 1.82vw;
    }

    .bookmark-innershadow {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 1.41vw;
      height: 1.82vw;
      border-radius: 0.21vw;
      box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.25);
    }
`;

export default Bookmark;