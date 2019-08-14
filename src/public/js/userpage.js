import { sendData } from "./util.js";

const writerId = window.location.pathname.split('/')[2];
const subscribersElem = document.getElementById('subscribers');
const subscriptionBtn = document.getElementById('subscription-button');

function getSubscribers() {
  return parseInt(subscribersElem.innerText.slice(0, -1) ,10);
}

subscriptionBtn.addEventListener('click', e => {
  if (subscriptionBtn.classList.contains('toggle-on')) {
    subscription(e);
  } else if (subscriptionBtn.classList.contains('toggle-off')) {
    unsubscription(e);
  }
});

async function subscription(e) {
  subscriptionBtn.setAttribute('disabled', '');
  try {
    const res = await sendData('POST', `/user/subscriptions/${writerId}`);

    if(res.status === 200) {
      const subscribers = getSubscribers();
      subscribersElem.innerText = `${subscribers+1}명`;
      subscriptionBtn.classList.add('toggle-off');
      subscriptionBtn.classList.remove('toggle-on');
      subscriptionBtn.innerText = '구독 취소';
    } else {
      const resJson = await res.json();
      UIkit.notification(resJson.message, {status: 'danger'});
    }
  } catch (error) {
    UIkit.notification('서버에서 오류가 발생했습니다.', {status: 'danger'});
  } finally {
    subscriptionBtn.removeAttribute('disabled');
  }
}

async function unsubscription(e) {
  subscriptionBtn.setAttribute('disabled', '');
  try {
    const res = await sendData('DELETE', `/user/subscriptions/${writerId}`);

    if(res.status === 200) {
      const subscribers = getSubscribers();
      subscribersElem.innerText = `${subscribers - 1}명`;
      subscriptionBtn.classList.add('toggle-on');
      subscriptionBtn.classList.remove('toggle-off');
      subscriptionBtn.innerText = '구독';
    } else {
      const resJson = await res.json();
      UIkit.notification(resJson.message, {status: 'danger'});
    }
  } catch (error) {
    UIkit.notification('서버에서 오류가 발생했습니다.', {status: 'danger'});
  } finally {
    subscriptionBtn.removeAttribute('disabled');
  }
}
