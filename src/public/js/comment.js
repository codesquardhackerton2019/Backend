import { domParser, getLoadingAnimation, sendData, sendGetOrHead } from './util.js';

const container = document.getElementById('comment-area');
const currentUrl = window.location.pathname;
const articleId = currentUrl.split('/')[2];
const commentSubmitButton = document.getElementById('comment-submit');
const commentForm = document.getElementById('comment-form');
const commentTextArea = document.getElementById('comment-textarea');
let page = 1, enableLikeEvent = true, enableRemoveEvent = true;



async function getComments(articleId) {
  try {
    const res = await sendGetOrHead('GET', `/article/${articleId}/comments?page=${page++}`);
    const rawHtml = await res.text();

    return rawHtml;
  } catch (error) {
    throw error;
  }
}

function appendElements(target, rawHtml) {
  const newNodes = domParser.parseFromString(rawHtml, 'text/html');
  newNodes.body.childNodes.forEach(card => target.appendChild(card));
}


const infScroll = new InfiniteScroll('#comment-area', {
  path: () => 'https://',
});

infScroll.on('scrollThreshold', async (e) => {
  if(!infScroll.options.loadOnScroll) return

  const loadingAnimation = container.appendChild(getLoadingAnimation().body.childNodes[0]);
  try {
    infScroll.option({loadOnScroll: false});
    const rawHtml = await getComments(articleId);
    if (rawHtml) {
      container.removeChild(loadingAnimation);
      appendElements(container, rawHtml);
      infScroll.option({loadOnScroll: true});
    } else {
      container.removeChild(loadingAnimation);
      infScroll.destroy();
    }
  } catch (error) {
    container.removeChild(loadingAnimation);
    infScroll.destroy();
  }
});

container.addEventListener('click', e => {
  if(e.target.classList.contains('comment-like-btn')) {
    likeAction(e);
  } 
  else if(e.target.classList.contains('remove-comment-btn') || 
          e.target.parentElement.classList.contains('remove-comment-btn') ) {
    removeComment(e);
  }
});

async function likeAction(e) {
  if(!enableLikeEvent) return;
  const target = e.target, commentIdInput = e.target.querySelector('.comment-id');
  let res;
  enableLikeEvent = false;
  try {
    if(target.classList.contains('like-toggle-on')) {
      res = await sendData('POST', `/article/${articleId}/comments/${commentIdInput.value}/like`);
      if ( res.status === 200 ) {
        target.classList.remove('like-toggle-on');
        target.classList.remove('far');
        target.classList.add('like-toggle-off');
        target.classList.add('fas');
      } else {
        throw new Error();
      }
    } else if (target.classList.contains('like-toggle-off')) {
      res = await sendData('DELETE', `/article/${articleId}/comments/${commentIdInput.value}/like`);
      if ( res.status === 200 ) {
        target.classList.add('like-toggle-on');
        target.classList.add('far');
        target.classList.remove('like-toggle-off');
        target.classList.remove('fas');
      } else {
        throw new Error();
      }

    }
  } catch (error) {
    const resJson = await res.json();
    UIkit.notification(resJson.message || '서버에 문제가 발생했습니다.', 'danger');
  } finally {
    enableLikeEvent = true;
  }
}

async function removeComment(e) {
  if(!enableRemoveEvent) return;
  const target = e.target, commentIdInput = e.target.parentElement.querySelector('.comment-id');
  let res;
  enableRemoveEvent = false;
  try {
    res = await sendData('DELETE', `/article/${articleId}/comments/${commentIdInput.value}`);
    if ( res.status === 200 ) {
      location.reload();
    } else {
      throw new Error();
    }
  } catch (error) {
    const resJson = await res.json();
    UIkit.notification(resJson.message || '서버에 문제가 발생했습니다.', 'danger');
  } finally {
    enableRemoveEvent = true;
  }
}
