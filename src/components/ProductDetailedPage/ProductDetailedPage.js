import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailedPage.scss';
import Nav from '../Nav/Nav';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Reviews from './Reviews';
import BoardOne from './BoardOne';
import BoardTwo from './BoardTwo';
import SelectDown from './SelectDown';
import { BASE_URL } from '../../config';

function ProductDetailedPage({ converPrice }) {
  const params = useParams();
  const [number, setNumber] = useState(1);
  const [state, setState] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishAdd, setIsWishAdd] = useState(false);
  const [isCartAdd, setIsCartAdd] = useState(false);
  const [comment, setComment] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [visibleOne, setVisibleOne] = useState(true);
  const [visibleTwo, setVisibleTwo] = useState(true);

  const reviewRef = useRef();

  useEffect(() => {
    fetch(`http://13.209.43.32:8000/products/goods/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(result => setState(result.data))
      .then(() => setIsLoaded(true));
    fetch(`http://13.209.43.32:8000/products/review/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(result => setComment(result.data));
    const handleShowButton = () => {
      if (window.scrollY > 650) {
        setShowButton(true);
        setShowSelect(true);
      } else {
        setShowButton(false);
        setShowSelect(false);
      }
    };
    window.addEventListener('scroll', handleShowButton);
    return () => {
      window.removeEventListener('scroll', handleShowButton);
    };
  }, []);

  const select = state.filter(value => value.id == params.id);
  const change = select[0];

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };
  const increaseNumber = () => {
    setNumber(number + 1);
  };
  const decreaseNumber = () => {
    setNumber(number - 1);
  };
  const clickScrollReview = () => {
    reviewRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const wishAddHandler = () => {
    setIsWishAdd(!isWishAdd);
  };
  const wishCountHandler = () => {
    wishAddHandler();
    if (!isWishAdd) {
      fetch(`http://${BASE_URL}:8000/like/addlike`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          token: localStorage.getItem('token'),
        },
        body: JSON.stringify({
          product_id: params.id,
        }),
      });
      alert('찜 목록에 추가되었습니다');
    } else if (isWishAdd) {
      fetch(`http://${BASE_URL}:8000/like/removelike`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          token: localStorage.getItem('token'),
        },
        body: JSON.stringify({
          product_id: params.id,
        }),
      });
      alert('찜 목록에서 삭제되었습니다');
    }
  };

  const cartAddHandler = () => {
    setIsCartAdd(!isCartAdd);
  };
  const cartCountHandler = () => {
    cartAddHandler();
    if (!isCartAdd) {
      fetch(`http://${BASE_URL}:8000/cart/update`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          token: localStorage.getItem('token'),
        },
        body: JSON.stringify({
          product_id: params.id,
          put_quantity: number,
        }),
      });
    }
    alert('장바구니에 추가되었습니다');
  };

  return (
    <>
      <Nav />
      <Header />
      {isLoaded && (
        <div className="detailContainer">
          {showButton && (
            <div className="scrollContainer">
              <button id="top" onClick={scrollToTop} type="button">
                <img src="/icons/top.webp" alt="탑" />
              </button>
            </div>
          )}
          {showSelect && (
            <SelectDown
              title={change.title}
              number={number}
              price={change.price}
              increase={increaseNumber}
              decrease={decreaseNumber}
              converPrice={converPrice}
              isWishAdd={isWishAdd}
              wishCountHandler={wishCountHandler}
              cartCountHandler={cartCountHandler}
            />
          )}
          <article className="mainDetail">
            <img className="mainImage" src={change.img} alt="메인이미지" />

            <div className="infoContainer">
              <div className="productTitle">
                <div className="titleWrap">
                  <p className="titleDelivery">샛별배송</p>
                  <p className="title">{change.title}</p>
                  <p className="titleShort">{change.sub_name}</p>
                </div>

                <div className="discountPriceWrap">
                  <span className="discountRate">
                    {/* {change.sale ? `${change.sale * 100}%` : null} */}
                  </span>
                  <span className="discountPrice">
                    {/* {change.sale
                      ? change.price - change.sale * change.price
                      : change.price} */}
                    {converPrice(change.price)}
                  </span>
                  <span className="discountWon">원</span>
                </div>

                {/* <div className="priceWrap">
                  <span className="price">
                    {(change.sale ? `${change.sale * 100}%` : null) &&
                      `${change.price}원`}
                    {converPrice(change.price)}
                  </span>
                </div> */}
              </div>

              <div className="productInfoWrap">
                <div className="productInfoSection">
                  <p className="InfoTitle">배송</p>
                  <div className="InfoContent">
                    <p>샛별배송</p>
                    <p className="InfoConTime">
                      23시 전 주문 시 아침 7시 전 도착 <br />
                      (대구・부산・울산 샛별배송 운영시간 별도확인)
                    </p>
                  </div>
                </div>

                <div className="productInfoSection">
                  <p className="InfoTitle">판매자</p>
                  <div className="InfoContent">
                    <p>컬리</p>
                  </div>
                </div>

                <div className="productInfoSection">
                  <p className="InfoTitle">원산지</p>
                  <div className="InfoContent">
                    <p>{change.country_id}</p>
                  </div>
                </div>

                <div className="productChoice">
                  <div className="productInfoSection">
                    <p className="InfoTitle">상품선택</p>
                    <div className="selctionQuantity">
                      <p className="quantityTitle">{change.title}</p>
                      <p className="quantityShort">적립제외상품</p>

                      <div className="quantityWrap">
                        <div className="quantityButton">
                          <button
                            className="downButton"
                            type="button"
                            onClick={decreaseNumber}
                          >
                            <img
                              src="/icons/minus.png"
                              width="28px"
                              alt="마이너스"
                            />
                          </button>
                          <span className="countNumber">{number}</span>
                          <button
                            className="upButton"
                            type="button"
                            onClick={increaseNumber}
                          >
                            <img
                              src="/icons/plus.png"
                              width="28px"
                              alt="플러스"
                            />
                          </button>
                        </div>

                        <div className="onePrice">
                          <span className="beforePrice">
                            {/* {(change.sale ? `${change.sale * 100}%` : null) &&
                              `${change.price}원`} */}
                          </span>
                          <span className="afterPrice">
                            {/* {(change.sale ? `${change.sale * 100}%` : null)
                              ? `${
                                  change.sale
                                    ? change.price - change.sale * change.price
                                    : change.price
                                }원`
                              : `${change.price}원`} */}
                            {`${converPrice(change.price)}원`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="totalContainer">
                <div className="totalWrap">
                  <span className="totalText">총 상품금액:</span>
                  <span className="totalPrice">
                    {/* {(change.sale ? `${change.sale * 100}%` : null)
                      ? `${
                          (change.sale
                            ? change.price - change.sale * change.price
                            : change.price) * number
                        }`
                      : `${change.price * number}`} */}
                    {converPrice(change.price * number)}
                  </span>
                  <span className="totalWon">원</span>
                </div>
              </div>

              <div className="buttonContainer">
                <button className="heartButton" onClick={wishCountHandler}>
                  <span>
                    <img
                      className="purpleHeart"
                      src={
                        isWishAdd
                          ? '/icons/redheart.png'
                          : '/icons/purpleHeart.png'
                      }
                      width="24px"
                      alt="찜아이콘"
                    />
                  </span>
                </button>

                <div className="cartWrap">
                  <button
                    className="cartButton"
                    radius="3"
                    onClick={cartCountHandler}
                  >
                    <span className="cartText">장바구니 담기</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

          <div className="navContainer">
            <nav className="detailNav">
              <div className="productDes">
                <button>
                  <span>상품설명</span>
                </button>
              </div>
              <div className="datailInfo">
                <button>
                  <span>상세정보</span>
                </button>
              </div>
              <div className="review">
                <button onClick={clickScrollReview}>
                  <span>후기</span>
                  <span>{`(${comment.length})`}</span>
                </button>
              </div>
              <div className="inquiry">
                <button>
                  <span>문의</span>
                </button>
              </div>
            </nav>
          </div>

          <div className="whyKurly">
            <div className="whyTitle">
              <span>WHY GOOMEONG</span>
            </div>
            <div className="whyContent">
              <div className="whyOne">
                <div className="iconCircleWrap">
                  <div className="iconCircle">
                    <img src="/icons/note.png" alt="체크" width="30px" />
                  </div>
                  <p className="whyContentTitle">깐깐한 상품위원회</p>
                </div>
                <div className="whyContentText">
                  <p>
                    나와 내 가족이 먹고 쓸 상품을 고르는
                    <br />
                    마음으로 매주 상품을 직접 먹어보고,
                    <br />
                    경험해보고 성분, 맛, 안정성 등 다각도의
                    <br />
                    기준을 통과한 상품만을 판매합니다.
                  </p>
                  <span>(온라인 기준 / 자사몰, 직구 제외)</span>
                </div>
              </div>

              <div className="whyOne">
                <div className="iconCircleWrap">
                  <div className="iconCircle">
                    <img
                      src="/icons/presentation.png"
                      alt="체크"
                      width="30px"
                    />
                  </div>
                  <p className="whyContentTitle">차별화된 GOOMEONG Only 상품</p>
                </div>
                <div className="whyContentText">
                  <p>
                    전국 각지와 해외의 훌륭한 생산자가
                    <br />
                    믿고 선택하는 파트너, 구멍마켓
                    <br />
                    3천여 여개 넘는 구멍마켓 단독 브랜드, 스펙의
                    <br />
                    구멍 Only 상품을 믿고 만나보세요.
                  </p>
                  <span>(온라인 기준 / 자사몰, 직구 제외)</span>
                </div>
              </div>

              <div className="whyOne">
                <div className="iconCircleWrap">
                  <div className="iconCircle">
                    <img src="/icons/truck.png" alt="체크" width="30px" />
                  </div>
                  <p className="whyContentTitle">신선한 풀콜드체인 배송</p>
                </div>
                <div className="whyContentText">
                  <p>
                    온라인 업계 최초로 산지에서 문 앞까지
                    <br />
                    상온, 냉장, 냉동 상품을 분리 포장 후
                    <br />
                    최적의 온도를 유지하는 냉장 배송 시스템,
                    <br />
                    풀콜드체인으로 상품을 신선하게 전해드립니다.
                  </p>
                  <span>(샛별배송에 한함)</span>
                </div>
              </div>

              <div className="whyOne">
                <div className="iconCircleWrap">
                  <div className="iconCircle">
                    <img src="/icons/magnifier.png" alt="체크" width="30px" />
                  </div>
                  <p className="whyContentTitle">
                    고객, 생산자를 위한 최선의 가격
                  </p>
                </div>
                <div className="whyContentText">
                  <p>
                    매주 대형 마트와 주요 온라인 마트의 가격
                    <br />
                    변동 상황을 확인해 신선식품은 품질을
                    <br />
                    타협하지 않는 선에서 최선의 가격으로,
                    <br />
                    가공식품은 언제나 합리적인 가격으로
                    <br />
                    정기 조정합니다.
                  </p>
                </div>
              </div>

              <div className="whyOne">
                <div className="iconCircleWrap">
                  <div className="iconCircle">
                    <img src="/icons/recycle.png" alt="체크" width="30px" />
                  </div>
                  <p className="whyContentTitle">
                    환경을 생각하는 지속 가능한 유통
                  </p>
                </div>
                <div className="whyContentText">
                  <p>
                    친환경 포장재부터 생산자가 상품에만
                    <br />
                    집중할 수 있는 직매입 유통구조까지,
                    <br />
                    지속 가능한 유통을 고민하며 구멍마켓을
                    <br />
                    있게 하는 모든환경(생산자,커뮤니티,직원)이
                    <br />더 나아질 수 있도록 노력합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="customerContainer">
            <div className="customerService">
              <div className="customerTitle">
                <h5>고객행복센터</h5>
                <p>
                  궁금하신 점이나 서비스 이용에 불편한 점이 있으신가요?
                  <span>
                    문제가 되는 부분을 사진으로 찍어 아래 중 편하신 방법으로
                    접수해 주시면 빠르게 도와드리겠습니다.
                  </span>
                </p>
              </div>
              <ul>
                <li>
                  <strong>전화 문의 1777-7777</strong>
                  <span>오전 7시~오후 7시(연중무휴)</span>
                </li>
                <li>
                  <strong>카카오톡 문의</strong>
                  <span>오전 7시~오후 7시(연중무휴)</span>
                  <strong>
                    카카오톡에서 '구멍마켓'을 검색 후<br />
                    대화창에 문의 및 불편사항을
                    <br />
                    남겨주세요.
                  </strong>
                </li>
                <li>
                  <strong>홈페이지 문의</strong>
                  <span>
                    24시간 접수 가능
                    <br />
                    로그인 &gt; 마이컬리 &gt; 1:1문의
                  </span>
                  <strong>
                    고객센터 운영 시간에 순차적으로
                    <br />
                    답변해드리겠습니다.
                  </strong>
                </li>
              </ul>
            </div>
          </div>

          <div className="guide">
            <div className="exchange">
              <div className="exchangeTitle">
                <strong>교환 및 환불 안내</strong>
                <p>교환 및 환불이 필요하신 경우 고객행복센터로 문의해주세요.</p>
                <button
                  className="detailBtnFirst"
                  onClick={() => setVisibleOne(!visibleOne)}
                >
                  {visibleOne ? '닫기' : '자세히보기'}
                </button>
              </div>
            </div>
            <div className="boardOne">{visibleOne ? <BoardOne /> : null}</div>

            <div className="cancelOrder">
              <strong>주문 취소 안내</strong>
              <p>
                <strong className="cancelStrong">
                  - [주문완료] 상태일 경우에만 주문 취소 가능합니다.
                  <br />- [마이구멍마켓 &gt; 주문내역 상세페이지] 에서 직접
                  취소하실 수 있습니다.
                </strong>
              </p>
              <button
                className="datailBtnSecond"
                onClick={() => setVisibleTwo(!visibleTwo)}
              >
                {visibleTwo ? '닫기' : '자세히보기'}
              </button>
            </div>
            {visibleTwo ? <BoardTwo /> : null}

            <div className="deliveryInfo">
              <strong>배송관련 안내</strong>
              <p>
                배송 과정 중 기상 악화 및 도로교통 상황에 따라 부득이하게 지연
                배송이 발생될 수 있습니다.
              </p>
            </div>
          </div>

          <div className="reviewList" ref={reviewRef}>
            <section>
              <header>
                <h2>상품 후기</h2>
              </header>
              <ul>
                <li>글후기 50원 적립금 혜택이 있어요.</li>
                <li>・주간 베스트 후기로 선정 시 5,000원을 추가 적립</li>
                <li>・후기 작성은 배송완료일로부터 30일 이내 가능합니다.</li>
                <li>
                  ・작성하신 후기는 확인 후 적립금이 지급됩니다. (영업일 기준
                  평균 1~2일 소요)
                </li>
              </ul>

              <div className="reviewForm">
                <div className="reviewCount">
                  <span>{`총 ${comment.length}개`}</span>
                  {/* <div>
                    <button>최근등록순</button>
                  </div> */}
                </div>
                <div className="reviewPointNotice">
                  <span>공지</span>
                  <button>상품 후기 적립금 정책 안내</button>
                </div>
                <div className="reviewBestNotice">
                  <span>공지</span>
                  <button>금주의 Best 후기 안내</button>
                </div>

                {comment.map(values => {
                  const { id, username, comment, updated_at } = values;

                  return (
                    <Reviews
                      key={id}
                      id={id}
                      username={username}
                      comment={comment}
                      title={change.title}
                      update={updated_at}
                    />
                  );
                })}
              </div>
              <div className="reviewsBtnWrap">
                <button className="reviewsBefBtn"></button>
                <button className="reviewsAftBtn"></button>
              </div>
            </section>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default ProductDetailedPage;
