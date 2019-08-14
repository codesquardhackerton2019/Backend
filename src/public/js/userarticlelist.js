import { domParser, getLoadingAnimation, sendGetOrHead } from './util.js';

const container = document.querySelector('.container');
const currentUrl = window.location.pathname;
const userId = currentUrl.split('/')[2];
let page = 1;

async function getUserArticleList(userId) {
  try {
    const res = await sendGetOrHead('GET', `/article/user/${userId}/page/${page++}`);
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


const infScroll = new InfiniteScroll('.container', {
  path: () => 'https://',
});

infScroll.on('scrollThreshold', async (e) => {
  if(!infScroll.options.loadOnScroll) return

  const loadingAnimation = container.appendChild(getLoadingAnimation().body.childNodes[0]);
  try {
    infScroll.option({loadOnScroll: false});
    const rawHtml = await getUserArticleList(userId);
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

// Execute first loading
(async () => {
  try {
    const rawHtml = await getUserArticleList(userId);
    appendElements(container, rawHtml);
  } catch (error) {
    infScroll.destroy();
  }
})();
