import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from './Menu/Menu';
import Main from './Main/Main';
import Mainlogin from './Mainlogin/Mainlogin';
import Mainsignup from './Mainsignup/Mainsignup';
import Mainbasket from './Mainbasket/Mainbasket';
import Incart from '../components/Maincontent/Incart';
import Post from '../components/Signup/Post';
import ProductDetailedPage from '../components/ProductDetailedPage/ProductDetailedPage';
import { BASE_URL } from '../config';
function Router() {
  const converPrice = price => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const [cart, setCart] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  //API
  const mockData = `http://${BASE_URL}:8000/products/main`;
  //mock
  // const mockData = `http://13.209.43.32:3000/data/mockData.json`;

  useEffect(() => {
    fetch(mockData)
      .then(res => res.json())
      .then(json => setData(json.data));
  }, []);

  //검색창 활성화 구현
  const filterTitle = data.filter(item =>
    item.title
      .replace(' ', '')
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase().replace(' ', ''))
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Main
              data={data}
              cart={cart}
              setCart={setCart}
              converPrice={converPrice}
              filterTitle={filterTitle}
              setSearch={setSearch}
            />
          }
        />
        <Route
          path="/basket"
          element={
            <Mainbasket
              cart={cart}
              converPrice={converPrice}
              setCart={setCart}
            />
          }
        />
        <Route path="/signup" element={<Mainsignup />} />
        <Route path="/address" element={<Post />} />
        <Route path="/login" element={<Mainlogin />} />
        <Route
          path="/products/:tabId"
          element={
            <Menu
              data={data}
              setData={setData}
              converPrice={converPrice}
              setSearch={setSearch}
              search={search}
            />
          }
        />

        <Route path="/incart" element={<Incart />} />
        <Route
          path="/goods/:id"
          element={<ProductDetailedPage converPrice={converPrice} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
