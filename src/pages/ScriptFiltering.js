import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ScriptItem from '../components/ScriptItem';
import ScriptItemLoading from '../components/ScriptItemLoading';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as scriptActions } from '../redux/modules/script';
import { actionCreators as userActions } from '../redux/modules/user';
import { useInView } from 'react-intersection-observer';
import { history } from '../redux/configureStore';
import { getCookie } from '../shared/Cookie';
import { alertNew } from '../shared/alert';

const ScriptFiltering = () => {
  const [filter, setFilter] = useState([]);
  const [topic, setTopic] = useState([]);
  const [my_script, setMyScript] = useState(false);

  const [done, setDone] = useState(false);
  const [reset, setReset] = useState(false);

  // 무한 스크롤 구현부
  const [pageNumber, setPageNumber] = useState(1); //첫페이지 넘버값 1

  const [ref, inView] = useInView(); 

  const is_login = useSelector(state => state.user.is_login);
  const token = getCookie('token'); 

  useEffect(()=>{
    if(!token){
      alertNew('로그인 후에 이용할 수 있습니다.',()=>{
        history.replace('/');
        dispatch(userActions.setLoginModal(true));
      });
    }
  },[is_login])

  useEffect(() => {
    if (inView && pageNumber !== 0) {
      setPageNumber((pageNumber) => pageNumber + 1);
      // 스크롤 다운 시 페이지넘버 1씩 증가
      const _category = filter.length === 0 ? 'all' : filter.join('|').split('').map((a) => {
                if (a === '&') return '%26';
                if (a === '/') return '%2F';
                return a;
              }).join('');
      const _topic = topic.length === 0 ? 'all' : topic.join('|').split('').map((a) => (a === '&' ? '%26' : a)).join('');
      const _my_script = my_script ? 'ok' : '';
      dispatch(
        scriptActions.setFilterListDB(_category, _topic, pageNumber + 1, _my_script, true)
      ).then((res) => {
        // 무한스크롤 불러오는 경우에 true
        if (res === 'no') {
          setPageNumber(0);
          // 더 이상 불러올 스크립트 없을 때 'no'로 response 받아옴
        }
      });
    }
  }, [inView]);

  const scrollRef = useRef();

  const dispatch = useDispatch();

  const filter_list = useSelector((state) => state.script.filter_list);

  useEffect(() => {
    if (filter_list !== []) {
      dispatch(scriptActions.setFilterList([]));
    }
  }, []);

  const addFilter = (e) => {
    if (reset) setReset(false);
    const idx = filter.indexOf(e.target.innerText);
    if (idx === -1) {
      setFilter((list) => list.concat(e.target.innerText));
    } else if (idx !== -1) {
      setFilter((list) => list.filter((a) => a !== e.target.innerText));
    }
  };
  // const addFilterOverlap = (e) => {
  //   if (reset) setReset(false);
  //   if (filter.indexOf('1Agree / Disagree') === -1) {
  //     setFilter((list) => list.concat('1Agree / Disagree'));
  //     return;
  //   } else {
  //     setFilter((list) => list.filter((a) => a !== '1Agree / Disagree'));
  //     return;
  //   }
  // };
  const addTopic = (e) => {
    if (reset) setReset(false);
    const idx = topic.indexOf(e.target.innerText);
    if (idx === -1) {
      setTopic((list) => list.concat(e.target.innerText));
    } else if (idx !== -1) {
      setTopic((list) => list.filter((a) => a !== e.target.innerText));
    }
  };

  const FilterList = () => {
    setDone(true);
    setReset(true);
    setPageNumber(1); // 첫페이지 넘버값 1로 설정한것 넣어줌
    const _category = filter.length === 0 ? 'all' : filter.join('|').split('').map((a) => {
              if (a === '&') return '%26';
              if (a === '/') return '%2F';
              return a;
            }).join('');
    const _topic = topic.length === 0 ? 'all' : topic.join('|').split('').map((a) => (a === '&' ? '%26' : a)).join('');
    const _my_script = my_script ? 'ok' : '';

    dispatch(scriptActions.setFilterListDB(_category, _topic, 1, _my_script, false));
    setDone(false);
    scrollRef.current.scrollTo(0, 0);
  };

  const selectReset = () => {
    setFilter([]);
    setTopic([]);
    setMyScript(false);
    setReset(false);
  };

  const selectMyScript = () => {
    setMyScript(!my_script);
    setReset(false);
  }

  return (
    <>
      <FilteringWrapper>
        <div className='filtering-left'>
          <div className='filtering-title'>
            <h2>Filtering</h2>
            <p>원하는 조건을 모두 선택해주세요!</p>
          </div>
          <div className='filtering-left-inner'>
            <div className='filtering-box'>
              <div>
                <div className='filtering-box-title'>TOFEL</div>
                <ul>
                  <li
                    className={
                      filter.indexOf('Agree / Disagree') !== -1
                        ? 'filter-checked'
                        : ''
                    }
                  >
                    <span onClick={addFilter}>Agree / Disagree</span>
                  </li>
                  <li
                    className={
                      filter.indexOf('Multiple Choice') !== -1
                        ? 'filter-checked'
                        : ''
                    }
                  >
                    <span onClick={addFilter}>Multiple Choice</span>
                  </li>
                  <li
                    className={
                      filter.indexOf('Paired Choice') !== -1
                        ? 'filter-checked'
                        : ''
                    }
                  >
                    <span onClick={addFilter}>Paired Choice</span>
                  </li>
                  <li
                    className={
                      filter.indexOf('Good Idea') !== -1 ? 'filter-checked' : ''
                    }
                  >
                    <span onClick={addFilter}>Good Idea</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className='filtering-box-title'>IELTS</div>
                <ul>
                  <li
                    className={
                      filter.indexOf('Agree / Disagree') !== -1
                        ? 'filter-checked'
                        : ''
                    }
                  >
                    <span onClick={addFilter}>Agree / Disagree</span>
                  </li>
                  <li
                    className={
                      filter.indexOf('Both views') !== -1
                        ? 'filter-checked'
                        : ''
                    }
                  >
                    <span onClick={addFilter}>Both views</span>
                  </li>
                  <li
                    className={
                      filter.indexOf('Advantage / Disadvantage') !== -1
                        ? 'filter-checked'
                        : ''
                    }
                  >
                    <span onClick={addFilter}>Advantage / Disadvantage</span>
                  </li>
                  <li
                    className={
                      filter.indexOf('Problem & Solution') !== -1
                        ? 'filter-checked'
                        : ''
                    }
                  >
                    <span onClick={addFilter}>Problem &amp; Solution</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className='filtering-box'>
              <div className='filtering-box-title'>ARTICLE</div>
              <ul>
                <li
                  className={
                    filter.indexOf('The New York Times') !== -1
                      ? 'filter-checked'
                      : ''
                  }
                >
                  <span onClick={addFilter}>The New York Times</span>
                </li>
                <li
                  className={
                    filter.indexOf('National Geographic') !== -1
                      ? 'filter-checked'
                      : ''
                  }
                >
                  <span onClick={addFilter}>National Geographic</span>
                </li>
                <li
                  className={
                    filter.indexOf('The Korea Times') !== -1
                      ? 'filter-checked'
                      : ''
                  }
                >
                  <span onClick={addFilter}>The Korea Times</span>
                </li>
              </ul>
            </div>
            <div className='filtering-box'>
              <div className='filtering-box-title'>TOPIC</div>
              <ul>
                <li
                  className={
                    topic.indexOf('National(Korea)') !== -1
                      ? 'filter-checked'
                      : ''
                  }
                >
                  <span onClick={addTopic}>National(Korea)</span>
                </li>
                <li
                  className={
                    topic.indexOf('Health') !== -1 ? 'filter-checked' : ''
                  }
                >
                  <span onClick={addTopic}>Health</span>
                </li>
                <li
                  className={
                    topic.indexOf('World') !== -1 ? 'filter-checked' : ''
                  }
                >
                  <span onClick={addTopic}>World</span>
                </li>
                <li
                  className={
                    topic.indexOf('Culture') !== -1 ? 'filter-checked' : ''
                  }
                >
                  <span onClick={addTopic}>Culture</span>
                </li>
                <li
                  className={
                    topic.indexOf('Science & Technology') !== -1
                      ? 'filter-checked'
                      : ''
                  }
                >
                  <span onClick={addTopic}>Science &amp; Technology</span>
                </li>
                <li
                  className={
                    topic.indexOf('Economics') !== -1 ? 'filter-checked' : ''
                  }
                >
                  <span onClick={addTopic}>Economics</span>
                </li>
                <li
                  className={
                    topic.indexOf('Sports') !== -1 ? 'filter-checked' : ''
                  }
                >
                  <span onClick={addTopic}>Sports</span>
                </li>
                <li
                  className={
                    topic.indexOf('Travel') !== -1 ? 'filter-checked' : ''
                  }
                >
                  <span onClick={addTopic}>Travel</span>
                </li>
              </ul>
            </div>
            <FilteringBox last>
              <SavedCheck>
                <CheckBox on={my_script && 'on'} onClick={selectMyScript}>
                  <svg width='22' height='16'viewBox='0 0 22 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M2 5.66667L9.2 13L20 2' stroke='white' strokeWidth='4' strokeLinecap='round'/>
                  </svg>
                </CheckBox>
                <div>내가 저장한 스크립트만 보기</div>
              </SavedCheck>
            </FilteringBox>
          </div>
          {reset ? (
            <div className='filtering-reset-button' onClick={selectReset}>
              초기화
              <svg
                viewBox='0 0 16 19'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M2 11C2 9.35 2.67 7.85 3.76 6.76L2.34 5.34C0.9 6.79 0 8.79 0 11C0 15.08 3.05 18.44 7 18.93V16.91C4.17 16.43 2 13.97 2 11ZM16 11C16 6.58 12.42 3 8 3C7.94 3 7.88 3.01 7.82 3.01L8.91 1.92L7.5 0.5L4 4L7.5 7.5L8.91 6.09L7.83 5.01C7.89 5.01 7.95 5 8 5C11.31 5 14 7.69 14 11C14 13.97 11.83 16.43 9 16.91V18.93C12.95 18.44 16 15.08 16 11Z'
                  fill='white'
                />
              </svg>
            </div>
          ) : (
            <div className='filtering-complete-button' onClick={FilterList}>
              선택완료
            </div>
          )}
        </div>
        <div className='filtering-right' ref={scrollRef}>
          {filter_list !== 'no' &&
            !done &&
            filter_list.map((a, i) => {
              if (filter_list.length - 1 === i) {
                return <ScriptItem key={i} {...a} _ref={ref} />; // inView ref 넣어줌
              }
              return <ScriptItem key={i} {...a} />;
            })}
          {filter_list === 'no' && !done && (
            <>
              <div className='filtering-result-none'>
                필터링 결과가 없습니다.
              </div>
              <div className='filtering-result-sentence'>
                앞으로 더 많은 스크립트가 더 추가될 예정입니다.
              </div>
            </>
          )}
          {done && (
            <>
              <ScriptItemLoading />
              <ScriptItemLoading />
              <ScriptItemLoading />
            </>
          )}
        </div>
      </FilteringWrapper>
    </>
  );
};

const FilteringWrapper = styled.div`
  width: 92.45vw;
  height: 38.8vw;
  margin: 1.35vw auto 0;
  display: flex;
  justify-content: space-between;

  .filtering-left {
    flex: 33.1% 0 0;
    background-color: #f0f0f0;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.13);
    border-radius: 2.4vw;
    position: relative;

    .filtering-title {
      position: absolute;
      top: -1.38vw;
      left: calc(50% - 12.24vw);
      width: 24.48vw;
      height: 2.76vw;
      background: #000000;
      box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.1);
      border-radius: 1.56vw;
      color: #ffffff;
      display: flex;
      align-items: center;

      > h2 {
        margin: 0 0 0.26vw 0;
        flex: 43.8% 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: max-content;
        font-family: 'Paytone One';
        font-size: 1.56vw;
        font-weight: 400;
        letter-spacing: -0.015em;
        position: relative;

        &:before {
          content: '';
          display: block;
          height: 1.04vw;
          border-right: 0.05vw solid #f1f1f1;
          position: absolute;
          right: 0;
          top: calc(50% - 0.31vw);
        }
      }
      > p {
        padding-left: 0.52vw;
        box-sizing: border-box;
        flex: 56.2% 0 0;
        width: max-content;
        font-family: 'Noto Sans KR';
        font-weight: 500;
        font-size: 0.83vw;
        letter-spacing: -0.015em;
        color: #f1f1f1;
      }
    }

    .filtering-left-inner {
      display: flex;
      flex-direction: column;
      padding: 3.49vw 2.71vw 0;
      box-sizing: border-box;
      ul {
        list-style: none;
        margin: 0.31vw 0 0 0;
        padding: 0;
        li {
          font-weight: 500;
          font-size: 0.94vw;
          line-height: 1.3vw;
          letter-spacing: -0.015em;
          color: #878889;
          padding: 0.29vw 0;
          &.filter-checked span {
            color: #ff2e00;
          }
          > span {
            cursor: pointer;
          }
        }
      }

      .filtering-box {
        width: 100%;
        display: flex;
        margin-bottom: 0.99vw;
        flex-direction: column;

        .filtering-box-title {
          padding-left: 0.16vw;
          font-weight: 700;
          font-size: 1.04vw;
          letter-spacing: -0.015em;
          color: #242424;
        }

        &:first-of-type {
          position: relative;
          flex-direction: row;
          > div {
            width: 50%;
            > div {
              padding-left: 0.16vw;
              font-weight: 700;
              font-size: 1.04vw;
              letter-spacing: -0.015em;
              color: #242424;
            }
          }
          &:before {
            content: '';
            display: block;
            width: 25.42vw;
            height: 0.1vw;
            background-color: #c4c4c4;
            border-radius: 0.05vw;
            position: absolute;
            bottom: -0.36vw;
            left: calc(50% - 12.71vw);
          }
        }

        &:nth-of-type(3) {
          position: relative;
          > div {
            width: 100%;
          }
          > ul {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            > li {
              width: 50%;
            }
          }
          &:before {
            content: '';
            display: block;
            width: 25.42vw;
            height: 0.105vw;
            border-radius: 0.05vw;
            background-color: #c4c4c4;
            position: absolute;
            top: -0.73vw;
            left: calc(50% - 12.71vw);
          }
        }
        &:last-of-type {
          margin-top: 1.88vw;
          .filtering-saved-check {
            display: flex;
            align-items: center;

            font-family: 'Noto Sans KR';
            font-weight: 600;
            font-size: 1.04vw;
            line-height: 1.41vw;
            display: flex;
            align-items: center;
            letter-spacing: -0.015em;
            color: #878889;

            .check-box {
              width: 1.98vw;
              height: 1.98vw;
              background: #d2d2d2;
              border-radius: 0.26vw;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 0.63vw;
              cursor: pointer;
            }
          }
        }
      }
    }
    .filtering-complete-button {
      font-weight: 600;
      font-size: 1.04vw;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: -0.015em;
      color: #878889;

      width: 5.47vw;
      height: 2.45vw;
      border: 0.105vw solid #878889;
      border-radius: 3.28vw;
      position: absolute;
      bottom: 1.82vw;
      right: 1.82vw;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        border-color: #ff2e00;
        color: #ff2e00;
      }
    }

    .filtering-reset-button {
      font-weight: 600;
      font-size: 1.04vw;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: -0.015em;
      color: #fff;

      width: 5.47vw;
      height: 2.45vw;
      background-color: #636366;
      border-radius: 3.28vw;
      position: absolute;
      bottom: 1.82vw;
      right: 1.82vw;
      cursor: pointer;
      transition: 0.3s;

      > svg {
        width: 0.83vw;
        height: 0.99vw;
      }

      &:hover {
        background-color: #000;
      }
    }
  }

  .filtering-right {
    width: 60.31vw;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.31vw;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #000;
      border-radius: 0.16vw;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    .filtering-result-none {
      width: max-content;
      margin: 1.04vw auto;
      font-family: 'Noto Sans KR';
      font-size: 1.04vw;
      font-weight: 600;
    }
    .filtering-result-sentence {
      width: max-content;
      margin: 0 auto;
      font-family: 'Noto Sans KR';
      font-size: 0.73vw;
      font-weight: 300;
    }
  }
`;

const FilteringBox = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 0.99vw;
  flex-direction: column;

  ${props=>props.last && 'margin-top: 1.88vw'};
`;
const SavedCheck = styled.div`
  display: flex;
  align-items: center;

  font-family: 'Noto Sans KR';
  font-weight: 600;
  font-size: 1.04vw;
  line-height: 1.41vw;
  display: flex;
  align-items: center;
  letter-spacing: -0.015em;
  color: #878889;
`;
const CheckBox = styled.div`
  width: 1.98vw;
  height: 1.98vw;
  background: #d2d2d2;
  border-radius: 0.26vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.63vw;
  cursor: pointer;
  >svg{
    width: 1.15vw;
    height: 0.83vw;
  }
  >svg path{
    transition: 0.3s;
    stroke: ${props => props.on ? '#000' : '#fff'};
  }
`;
export default ScriptFiltering;
