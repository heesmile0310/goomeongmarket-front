import { React, useState, useEffect } from 'react';
import './Signup.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faMugSaucer,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Post from './Post';

import { BASE_URL } from '../../config';

//이메일.비밀번호 정규표현식
const EMAIL_REGEX = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PWD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

function Signup() {
  const [submitPrevent, setSubmitPrevent] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setVaildPassword] = useState(false);
  const [samePwd, setSamePwd] = useState('');
  const [validSamePwd, setValidSamePwd] = useState(false);
  const [username, setusername] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender_id, setGender] = useState('');
  const [checkList, setCheckList] = useState([]);
  const [active, setActive] = useState('button');
  const [date, setDate] = useState('');
  const [validDate, setValidDate] = useState(false);
  const [year, setYear] = useState('');
  const [validYear, setValidYear] = useState(false);
  const [month, setMonth] = useState('');
  const [validMonth, setValidMonth] = useState(false);
  const birthDatePlus = year + month + date;
  const [emailBtnDisable, setEmailBtnDisable] = useState(false);
  const [signupHadle, setSignupHandle] = useState(false);
  const [enroll_company, setEnroll_company] = useState({
    address: '',
  });
  const [addressBtn, setAddressBtn] = useState(false);
  const [popup, setPopup] = useState(false);

  const handleInput = e => {
    console.log(enroll_company);
    setEnroll_company({
      ...enroll_company,
      [e.target.name]: e.target.value,
    });
  };

  const handleComplete = data => {
    setPopup(!popup);
    setAddressBtn(true);
  };
  const sendHandler = e => {
    console.log(submitPrevent);
    e.preventDefault();
    fetch(`http://${BASE_URL}:8000/users/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        username: username,
        address: enroll_company.address,
        phoneNumber: phoneNumber,
        birthDate: birthDatePlus,
        gender_id: gender_id,
      }),
    }).then(res => res.json());
    // .then(res => console.log(res));
    if (!validEmail) {
      alert('이메일 형식이 맞지 않습니다.');
    } else if (!emailBtnDisable) {
      alert('이메일 중복 확인이 되지 않았습니다.');
    } else if (!validPassword) {
      alert('비밀번호 형식에 맞지 않습니다.');
    } else if (!validSamePwd) {
      alert('비밀번호 확인이 같지 않습니다');
    } else if (username == '') {
      alert('이름을 입력해주세요.');
    } else if (phoneNumber.length !== 11) {
      alert('핸드폰 번호를 정확히 입력해주세요');
    } else if (birthDatePlus.length !== 8) {
      alert('생년월일을 8자리로 입력해주세요');
    } else if (gender_id == '') {
      alert('성별을 선택해주세요');
    } else if (
      !checkList.includes('must1') ||
      !checkList.includes('must2') ||
      !checkList.includes('must3')
    ) {
      alert('약관 동의 필수에 동의해주세요');
    } else {
      alert('회원가입에 성공하셨습니다');

      //setSubmitPrevent('submit');
      navigate('/login');
    }
  };

  // 전체동의 체크박스
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);
  useEffect(() => {
    setVaildPassword(PWD_REGEX.test(password));
    setValidSamePwd(password === samePwd);
  }, [password, samePwd]);
  useEffect(() => {
    setValidDate(date < 32);
    setValidMonth(month < 13);
    setValidYear(year < 2010);
  }, [date, year, month]);

  const checkAll = e => {
    e.target.checked
      ? setCheckList([
          'must1',
          'must2',
          'must3',
          'select1',
          'select2',
          'select3',
          'select4',
        ])
      : setCheckList([]);
  };
  const handleCheck = e => {
    e.target.checked
      ? setCheckList([...checkList, e.target.name])
      : setCheckList(checkList.filter(el => el !== e.target.name));
  };
  // useEffect(() => {
  //   if (
  //     checkList.includes('must1') &&
  //     checkList.includes('must2') &&
  //     checkList.includes('must3')
  //   ) {
  //     setActive('active');
  //   } else {
  //     setActive('button');
  //   }
  // }, [checkList]);

  // 이메일 중복 체크 로직
  const userEmailValidation = e => {
    e.preventDefault();

    if (!validEmail) {
      alert('이메일 형식이 아닙니다.');
    } else {
      fetch(`http://${BASE_URL}:8000/users/account2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      }).then(res => {
        if (res.status == 400) {
          alert('이미 사용중인 이메일입니다.');
          setEmailBtnDisable(false);
        } else {
          alert('사용가능한 이메일입니다.');
          setEmailBtnDisable(true);
        }
      });
    }
  };

  return (
    <div className="sign-up">
      {/*회원가입 타이틀 */}
      <div className="title">
        <h1>회원가입 </h1>
        <p>
          필수입력사항<span className="must-input">*</span>
        </p>
      </div>
      <form className="form-whole">
        <div className="form-input">
          {/* 아이디 */}
          <div className="input-container">
            <div className="input-name-container">
              <label className="form-label">
                이메일<span className="must-input">*</span>
              </label>
            </div>
            <div className="email-input-button-column">
              <input
                placeholder="이메일 형식으로 입력해주세요"
                className="real-input"
                type="text"
                onChange={e => setEmail(e.target.value)}
                name="email"
              />
              <button
                className={emailBtnDisable ? 'check-email-done' : 'check-email'}
                onClick={userEmailValidation}
                disabled={emailBtnDisable}
              >
                중복확인
              </button>
              <p
                id="uidnote"
                className={email && !validEmail ? 'cond_msg' : 'offscreen'}
              >
                정확한 이메일 형식으로 입력해주세요.
              </p>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="input-container">
            <div className="input-name-container">
              <label className="form-label">
                비밀번호<span className="must-input">*</span>
              </label>
            </div>
            <input
              name="password"
              className="real-input"
              placeholder="비밀번호를 입력해 주세요 "
              type="password"
              //value={'password'}
              onChange={e => setPassword(e.target.value)}
            />
            <p
              id="uidnote-pw"
              className={password && !validPassword ? 'cond_msg' : 'offscreen'}
            >
              비밀번호는 문자,숫자,특수기호를 포함하며 8자 이상으로 설정.
            </p>
            <p
              id="uidnote-pw"
              className={password && validPassword ? 'true-msg' : 'offscreen'}
            >
              보안에 좋은 형식입니다.
            </p>
          </div>
          {/* 비밀번호 확인 */}
          <div className="input-container">
            <div className="input-name-container">
              <label className="form-label">
                비밀번호 확인<span className="must-input">*</span>
              </label>
            </div>
            <input
              className="real-input"
              type="password"
              placeholder="비밀번호를 한번 더 입력해주세요 "
              onChange={e => setSamePwd(e.target.value)}
            />
            <p
              id="smaePwdNote"
              className={samePwd && !validSamePwd ? 'cond_msg' : 'offscreen'}
            >
              비밀번호가 일치하지 않습니다.
            </p>
            <p
              id="smaePwdNote"
              className={samePwd && validSamePwd ? 'true-msg' : 'offscreen'}
            >
              비밀번호가 일치합니다.
            </p>
          </div>
          {/* 이름 */}
          <div className="input-container">
            <div className="input-name-container">
              <label className="form-label">
                이름<span className="must-input">*</span>
              </label>
            </div>
            <input
              name="username"
              //value={'username'}
              className="real-input"
              type="text"
              placeholder="이름을 입력해주세요 "
              onChange={e => setusername(e.target.value)}
              //onChange={handleInput}
            />
            <div className="empty-box"> </div>
          </div>
          {/* 휴대폰 */}
          <div className="input-container">
            <div className="input-name-container">
              <label className="form-label">
                휴대폰<span className="must-input">*</span>
              </label>
            </div>
            <input
              onKeyPress={event => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              // onChange={e => {
              //   setPhoneNumber(e.target.value);
              // }}
              // onInput={e => {
              //   phoneNumber && !validPhoneNumber
              //     ? e.preventDefault()
              //     : e.preventDefault();
              // }}
              maxLength={11}
              className="real-input"
              type="text"
              placeholder="숫자만 입력해주세요 "
              value={phoneNumber}
              name="phoneNumber"
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </div>
          {/* 주소 */}
          <div className="input-container">
            <div className="input-name-container address-name">
              <label className="form-label">
                주소<span className="must-input">*</span>
              </label>
            </div>
            {/* <FontAwesomeIcon icon={faMagnifyingGlass} className="fa-glass" /> */}
            <button
              className={
                addressBtn ? 'addressBtn-none' : 'real-input address-button'
              }
              //value={'address'}
              name="address"
              onClick={handleComplete}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="fa-glass" />
              주소 검색
            </button>

            <p className="address-alert-message">
              배송지에 따라 상품 정보가 달라질 수 있습니다.
            </p>
            <input
              type={'text'}
              className="real-input address-add"
              required={true}
              name="address"
              onChange={handleInput}
              value={enroll_company.address}
            ></input>
            {popup && (
              <Post
                company={enroll_company}
                setcompany={setEnroll_company}
              ></Post>
            )}
          </div>
          {/* 성별 */}
          <div className="input-container">
            <div className="input-name-container gender-name">
              <label className="form-label">성별</label>
              <span className="must-input">*</span>
            </div>
            <div className="gender-input-container">
              <div className="gender-input-personal-container">
                <input
                  className="gender-input"
                  type="radio"
                  name="gender"
                  onChange={e => setGender(e.target.value)}
                  value={1}
                />
                <label className="gender-check-name">남자</label>
              </div>
              <div className="gender-input-personal-container women-check">
                <input
                  className="gender-input "
                  type="radio"
                  name="gender"
                  onChange={e => setGender(e.target.value)}
                  value={2}
                />
                <label className="gender-check-name">여자</label>
              </div>
              <div className="gender-input-personal-container select-nothing">
                <input
                  className="gender-input"
                  type="radio"
                  name="gender"
                  onChange={e => setGender(e.target.value)}
                  value={3}
                />
                <label className="gender-check-name">해당 사항 없음</label>
              </div>
            </div>
            <div className="empty-box"> </div>
          </div>
          {/* 생일 */}
          <div className="input-container birth-margin">
            <div className="input-name-container">
              <label className="form-label">
                생년월일<span className="must-input">*</span>
              </label>
            </div>
            <div className="real-input birth-input-column">
              <input
                type="text"
                onChange={e => setYear(e.target.value)}
                className="birth-input"
                placeholder="YYYY"
                maxLength={4}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <span>/</span>
              <input
                type="text"
                className="birth-input"
                onChange={e => setMonth(e.target.value)}
                placeholder="MM"
                maxLength={2}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <span>/</span>
              <input
                type="text"
                className="birth-input"
                placeholder="DD"
                maxLength={2}
                onChange={e => setDate(e.target.value)}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <p
                id="uidnote"
                className={
                  date && !validDate ? 'cond_msg add-birth-msg' : 'offscreen'
                }
              >
                한 달은 최대 31일로 구성되어 있습니다.
              </p>
              <p
                id="uidnote"
                className={
                  year && !validYear ? 'cond_msg add-birth-msg' : 'offscreen'
                }
              >
                14세 이상부터만 가입가능합니다.
              </p>
              <p
                id="uidnote"
                className={
                  month && !validMonth ? 'cond_msg add-birth-msg' : 'offscreen'
                }
              >
                12월 이상은 없습니다.
              </p>
            </div>
          </div>
          <div className="margin-box"> </div>
          {/* 이용약관동의 */}
          <div className="input-container">
            <div className="input-name-container padding-size">
              <label className="form-label">
                이용약관동의<span className="must-input">*</span>
              </label>
            </div>
            <div className="agree-column">
              <div className="agree-column-without">
                <input
                  type="checkbox"
                  id="check"
                  name="all"
                  checked={checkList.length === 7 ? true : false}
                  onChange={checkAll}
                />
                <label className="check-content" id="check" htmlFor="check">
                  전체 동의합니다.
                </label>
              </div>
              <p className="check-alert-message">
                선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를
                이용할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="input-container">
            <div className="agree-column">
              <div className="agree-column-without">
                <input
                  onChange={handleCheck}
                  type="checkbox"
                  id="check"
                  name="must1"
                  checked={checkList.includes('must1') ? true : false}
                />
                <label
                  className="check-content-else"
                  id="check"
                  htmlFor="check"
                >
                  이용약관 동의<span>(필수)</span>
                </label>
                <span className="look-description">약관보기 {' >'}</span>
              </div>
            </div>
          </div>
          <div className="input-container gap">
            <div className="agree-column">
              <div className="agree-column-without">
                <input
                  onChange={handleCheck}
                  type="checkbox"
                  id="check"
                  name="must2"
                  checked={checkList.includes('must2') ? true : false}
                />
                <label
                  className="check-content-else"
                  id="check"
                  htmlFor="check"
                >
                  개인정보 수집 및 이용 동의<span>(필수)</span>
                </label>
                <span className="look-description  not-first">
                  약관보기 {' >'}{' '}
                </span>
              </div>
            </div>
          </div>
          <div className="input-container gap">
            <div className="agree-column">
              <div className="agree-column-without">
                <input
                  onChange={handleCheck}
                  type="checkbox"
                  id="check"
                  name="select1"
                  checked={checkList.includes('select1') ? true : false}
                ></input>

                <label
                  className="check-content-else"
                  id="check"
                  htmlFor="check"
                >
                  개인정보 수집 및 이용 동의<span>(선택)</span>
                </label>
                <span className="look-description  not-first">
                  약관보기 {' >'}
                </span>
              </div>
            </div>
          </div>
          <div className="input-container gap">
            <div className="agree-column">
              <div className="agree-column-without">
                <input
                  type="checkbox"
                  id="check"
                  name="select2"
                  onChange={handleCheck}
                  checked={checkList.includes('select2') ? true : false}
                />
                <label
                  className="check-content-else"
                  id="check"
                  htmlFor="check"
                >
                  무료배송, 할인쿠폰 등 혜택/정보 수신 동의<span>(선택)</span>
                </label>
              </div>
            </div>
          </div>
          <div className="input-container gap">
            <div className="agree-column">
              <div className="agree-column-without">
                <div className="choose-one">
                  <input
                    type="checkbox"
                    id="check"
                    name="select3"
                    onChange={handleCheck}
                    checked={checkList.includes('select3') ? true : false}
                  />
                  <label
                    className="check-content-else"
                    id="check"
                    htmlFor="check"
                    name="select3"
                  >
                    SNS
                  </label>
                </div>

                <div className="choose-one">
                  <input
                    onChange={handleCheck}
                    name="select4"
                    type="checkbox"
                    id="check"
                    checked={checkList.includes('select4') ? true : false}
                  />
                  <label
                    className="check-content-else"
                    id="check"
                    htmlFor="check"
                  >
                    이메일
                  </label>
                </div>
              </div>
              <span className="delivery-alert">
                동의 시 한 달간 [5%적립] + [2만원 이상 무료배송] 첫 주문 후 안내
              </span>
            </div>
          </div>
          <div className="input-container gap2">
            <div className="agree-column">
              <div className="agree-column-without gap3">
                <input
                  onChange={handleCheck}
                  type="checkbox"
                  id="check"
                  name="must3"
                  checked={checkList.includes('must3') ? true : false}
                />
                <label
                  className="check-content-else"
                  id="check"
                  htmlFor="check"
                >
                  본인은 만 14세 이상입니다.<span>(필수)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* 가입하기 버튼 */}
        <div className="signup-button-div">
          <button onClick={sendHandler}>가입하기</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
