import React, { useState } from 'react';
import './Basket.scss';
import ProductList from './ProductList';
import { BASE_URL } from '../../config';
function Basket({ cart, converPrice, setCart }) {
  // const [liveValue, setLiveValue] = useState(0);

  // 장바구니 삭제하는 함수
  const onRemove = id => {
    setCart(cart.filter(el => el.id !== id));
  };

  // 장바구니 담은 배열값의 합
  let priceSum = cart.map(el => el.price);
  let sumArr = priceSum.reduce((acc, cur) => {
    return acc + cur;
  }, 0);

  //결제 시 정보 보내는 코드

  // const token = window.localStorage.setItem(
  //   'token',
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjY4MDE2OTAxfQ.pifO4BZ5PmFJK9L8I8RimpzNccThL-RNCSVNSHuTcyw'
  // );
  const getToken = window.localStorage.getItem('token');

  const payment = () => {
    if (getToken !== null) {
      fetch(`http://${BASE_URL}/products/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: getToken,
        },
        body: JSON.stringify({
          product_id: cart[0].id,
          ordered_number: cart[0].quantity,
        }),
      }).then(alert('결제완료!'));
    } else alert('로그인하세요 !');
  };

  console.log(cart);

  // const a = String(cart);
  // console.log(a.id);
  // const b = Number(a);
  // const c = JSON.stringify(cart);
  // console.log(c);
  // console.log(typeof c);

  return (
    <div className="basketBody">
      <div className="cartNameBox">
        <h2 className="letterSpacing fontSettingh2">장바구니</h2>
      </div>
      <div className="cartBoxWraper">
        <div className="cartBoxLeft">
          <div className="selectBox">
            <input className="checkBoxBtnHead" type="checkbox" id="check1" />
            <label form="check1" />
            <span>전체선택(0/{cart.length})</span>
            <span className="borderRightInBasket" />
            <button className="selectDelBox">선택삭제</button>
          </div>
          <div className="productBox">
            <ul>
              {cart.length === 0 ? (
                <div className="noProdInCart">
                  <h4>장바구니에 담긴 상품이 없습니다.</h4>
                </div>
              ) : (
                cart.map(cart => {
                  return (
                    <ProductList
                      key={cart.key}
                      converPrice={converPrice}
                      onRemove={onRemove}
                      cart={cart}
                    />
                  );
                })
              )}
            </ul>
          </div>
        </div>

        <div className="cartBoxRight">
          <div className="productInformationBox">
            <div className="cartBoxRightWraper">
              <div className="cartBoxRightHead">
                <div className="baesong">
                  <span className="locationIcon" />
                  <h4>배송지</h4>
                </div>
                <strong>배송지를 등록</strong>
                하고
                <br />
                <span>구매 가능한 상품을 확인하세요!</span>
                <button className="addressBox">
                  <span>
                    <img
                      className="addressBoxMagnifier"
                      alt=""
                      src="./img/free-icon-magnifier.png"
                    />
                    주소 검색
                  </span>
                </button>
              </div>

              <div className="cartBoxRightBody">
                <div className="cartBoxTop">
                  <span>상품금액</span>
                  <span>{converPrice(sumArr)}원</span>
                </div>
                <div className="cartBoxMid">
                  <span>배송비</span>
                  <span>{converPrice(sumArr >= 30000 ? '0' : '3000')}원</span>
                </div>
                <p className="benefits">
                  30,000원 추가주문 시,<strong>무료배송</strong>
                </p>
                <div className="cartBoxBot">
                  <span>결제예정금액</span>
                  <span>
                    {converPrice(sumArr >= 30000 ? sumArr : sumArr + 3000)}원
                  </span>
                </div>
              </div>
            </div>

            <div className="cartBoxRightFoo">
              <button
                onClick={payment}
                className="cartBoxRightFooBtn"
                type="button"
              >
                <span>
                  {cart.length >= 1 ? '결제' : '장바구니가 비었습니다.'}
                </span>
              </button>
              <ul className="listController">
                <li>[주문완료]상태일 경우에만 주문 취소 가능합니다.</li>
                <li>
                  [마이마켓 주문내역 상세페이지]에서 직접 취소하실 수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Basket;
