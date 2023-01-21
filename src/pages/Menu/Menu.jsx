import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import './Menu.scss';
import Nav from '../../components/Nav/Nav';
import SliderImages from '../../components/SliderImages/SliderImages';
import Footer from '../../components/Footer/Footer';
import TabContent from '../../components/Maincontent/TabContent';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../config';

function Menu({ data, setData, setSearch, converPrice, search }) {
  const params = useParams();
  const [tabList, setTabList] = useState([]);

  let { tabId } = params;

  //최종 API(각탭별 new,best,cheap)
  useEffect(() => {
    fetch(`${BASE_URL}/products/${tabId}`, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(res => setTabList(res.data));
  }, [tabId]);

  //가짜 목데이터
  // useEffect(() => {
  //   fetch(`http://13.209.43.32:3000/data/mock${tabId}.json`)
  //     .then(res => res.json())
  //     .then(res => setTabList(res.data));
  // }, [tabId]);

  return (
    <div className="menuPages">
      <Nav setSearch={setSearch} />
      <Header setSearch={setSearch} tabId={tabId} />
      <SliderImages />
      <TabContent
        data={data}
        setData={setData}
        converPrice={converPrice}
        tabList={tabList}
        search={search}
        setTabList={setTabList}
      />
      <Footer />
    </div>
  );
}

export default Menu;
