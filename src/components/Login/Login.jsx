import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import axios from 'axios';
import Modal from './Modal';
import { BASE_URL } from '../../config';
function Login() {
  const navigate = useNavigate();
  // const goToMain = () => {
  //   navigate('/main');
  // };
  // const goToSiginup = () => {
  //   navigate('/signup');
  // };
  const [modal, setModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //const navigate = useNavigate();
  const Error = useCallback(() => {
    setErrorMessage('아이디,비밀번호가 일치하지 않습니다.');
    let timer = setTimeout(() => {
      setErrorMessage('');
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleLogin = e => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/users/account1`, { email, password })
      .then(res => {
        if (res.status == 200) {
          localStorage.setItem('token', res.data.token);
          navigate('/');
        }
      })
      .catch(err => Error());
  };

  return (
    <div className="login-whole">
      <div className="login-title">
        <h1>로그인</h1>
      </div>
      <div className="login-input-column">
        <input
          className="id-input"
          onChange={e => setEmail(e.target.value)}
          type={'text'}
          placeholder="아이디를 입력해주세요"
        ></input>
        <input
          type={'password'}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
        ></input>
      </div>
      <div className="search-bar">
        <p>아이디 찾기</p>
        <p>|</p>
        <p>비밀번호 찾기</p>
      </div>
      <div className="button-column">
        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>
        <button className="sign-up-button">회원가입</button>
        <p className="error-message">{errorMessage}</p>
      </div>
      {/* 
      //{modal == true ? <Modal /> : null} */}
    </div>
  );
}

export default Login;
