import { sendData } from "./util.js";

const articleId = window.location.pathname.split('/')[2];
const likeBtn = document.getElementById('like-btn');
likeBtn.addEventListener('click', e => {
  if(likeBtn.classList.contains('like-toggle-on')) {
    likeArticle(e);
  } else if (likeBtn.classList.contains('like-toggle-off')) {
    retractLikeArticle(e);
  }
});

async function likeArticle(e) {
  likeBtn.classList.add('disabled-click');
  try {
    const res = await sendData('POST', `/article/likes/${articleId}`);

    if(res.status === 200) {
      likeBtn.classList.add('like-toggle-off');
      likeBtn.classList.add('fas');
      likeBtn.classList.remove('like-toggle-on');
      likeBtn.classList.remove('far');
    } else {
      const resJson = await res.json();
      UIkit.notification(resJson.message, {status: 'danger'});
    }
  } catch (error) {
    UIkit.notification('서버에서 오류가 발생했습니다.', {status: 'danger'});
  } finally {
    likeBtn.classList.remove('disabled-click');
  }
}

async function retractLikeArticle(e) {
  likeBtn.classList.add('disabled-click');
  try {
    const res = await sendData('DELETE', `/article/likes/${articleId}`);

    if(res.status === 200) {
      likeBtn.classList.add('like-toggle-on');
      likeBtn.classList.add('far');
      likeBtn.classList.remove('like-toggle-off');
      likeBtn.classList.remove('fas');
    } else {
      const resJson = await res.json();
      UIkit.notification(resJson.message, {status: 'danger'});
    }
  } catch (error) {
    UIkit.notification('서버에서 오류가 발생했습니다.', {status: 'danger'});
  } finally {
    likeBtn.classList.remove('disabled-click');
  }
}
