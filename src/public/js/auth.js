import { sendData, setEventIfElementExist, validateEmail } from './util.js';
const signInButton = document.getElementById('signin-btn');
const signOutButton = document.getElementById('signout-btn');
const signInIdInput = document.getElementById('signin-id-input');
const signInPasswordInput = document.getElementById('signin-password-input');
const signUpIdInput = document.getElementById('signup-id-input')
const signUpPasswordInput = document.getElementById('signup-password-input')
const signInCloseButton = document.querySelector('.uk-modal-close-default');

setEventIfElementExist(signInButton, 'click', async e => {
  e.preventDefault();

  const email = signInIdInput.value;
  const password = signInPasswordInput.value;

  if (!validateEmail(email)) {
    UIkit.notification('이메일 형식이 맞지 않습니다.', {status: 'danger'});
    signInIdInput.value = '';
    signInIdInput.focus;
    return;
  }

  if (!password){
    signInPasswordInput.focus;
    return;
  }

  signInButton.setAttribute('disabled', 'true');

  try {
    const res = await sendData('POST', '/auth/signin', {email, password});

    if (res.redirected) {
      location.href = res.url;
    } else {
      const resBody = await res.json();
      UIkit.notification(resBody.message || '서버에서 오류가 발생했습니다.', {status: 'danger'});
      signInPasswordInput.value = '';
      signInPasswordInput.focus;
    }

  } catch (error) {
    signInButton.setAttribute('disabled', 'false');
  }
});

setEventIfElementExist(signInCloseButton, 'click', e => {
  e.preventDefault();
  signInIdInput.value = '';
  signInPasswordInput.value = '';
});

setEventIfElementExist(signOutButton, 'click', async e => {
  e.preventDefault();

  signOutButton.setAttribute('disabled', 'true');

  try {
    const res = await sendData('POST', '/auth/signout');
    if (res.redirected) {
      location.href = res.url;
    }

  } catch (error) {
    signOutButton.setAttribute('disabled', 'false');
  }
});