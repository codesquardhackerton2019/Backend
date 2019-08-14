import { sendData, setEventIfElementExist, validateEmail, validatePassword } from './util.js';
const signUpButton = document.getElementById('signup-btn');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const passwordConfirmInput = document.getElementById('password-confirm-input');

setEventIfElementExist(signUpButton, 'click', async e => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = passwordConfirmInput.value;

  if (!validateEmail(email)) {
    UIkit.notification('이메일 형식이 맞지 않습니다.', {status: 'danger'});
    emailInput.value = '';
    emailInput.focus;
    return;
  }

  if (!validatePassword(password)) {
    UIkit.notification('최소 한 글자의 대소문자와 숫자, 특수문자를 포함하면서, 여덟 글자 이상이어야 합니다.', {status: 'danger'});
    passwordInput.value = '';
    passwordInput.focus;
    return;
  }

  if (password != confirmPassword) {
    UIkit.notification('비밀번호를 다시 확인해주세요.', {status: 'danger'});
    passwordConfirmInput.value = '';
    passwordConfirmInput.focus;
    return;
  }

  signUpButton.setAttribute('disabled', '');

  try {
    const res = await sendData('POST', '/auth/signup', {email, password});

    if (res.redirected) {
      location.href = res.url;
    } else {
      const resBody = await res.json();
      UIkit.notification(resBody.message || '서버에서 오류가 발생했습니다.', {status: 'danger'});
    }
  } catch (error) {
    UIkit.notification('예기치 않은 오류가 발생했습니다.', {status: 'danger'});
  } finally {
    emailInput.value = passwordInput.value = passwordConfirmInput.value = '';
    signUpButton.removeAttribute('disabled');
  }
});