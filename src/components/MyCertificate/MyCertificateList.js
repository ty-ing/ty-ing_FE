import React, { useEffect } from 'react';
import MyCertificate from './MyCertificate';
import { actionCreators as recordActions } from '../../redux/modules/record';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { MyPageTitleCertificate } from '../../pages/MyPage/style';

const MyCertificateList = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(recordActions.recordLoadDB());
  }, []);

  const recordLoad = useSelector((state) => state.record.record_list);

  const settings = {
    className: "slider variable-width",
      dots: false,
      infinite: false,
      centerMode: false,
      slidesToShow: 3,
      slidesToScroll: 3,
      variableWidth: true
  };

  return (
    <>
      <MyPageTitleCertificate>
        <h3>타잉 인증서</h3>
        <div>총 {recordLoad.length}개</div>
      </MyPageTitleCertificate>
      <MyCertificateSlider>
        <Slider {...settings}>
          {recordLoad.map((a,i)=>{
            return <MyCertificate key={i} {...a} _onClick={()=>{props.setModal(true)}}/>
          })}
        </Slider>
      </MyCertificateSlider>
    </>
  );
};

const MyCertificateSlider = styled.div`
  margin-top: 28px;
  .slick-list{
    padding-left: 60px;
  }
  .slick-slide{
    margin-right: 26px;
  }
`;

const EmptySlide = styled.div`
  width: 10px;
`;
export default MyCertificateList;
