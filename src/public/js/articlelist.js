import { domParser, getLoadingAnimation, sendGetOrHead } from './util.js';

const container = document.querySelector('.container');
let page = 1;

async function getArticleList() {
  try {
    const res = await sendGetOrHead('GET', `/article/page/${page++}`);
    const rawHtml = await res.text();

    return rawHtml;
  } catch (error) {
    throw error;
  }
}

function appendElements(rawHtml) {
    const newNodes = domParser.parseFromString(rawHtml, 'text/html');
    newNodes.body.childNodes.forEach(row => container.appendChild(row));
}

const infScroll = new InfiniteScroll('.container', {
  path: () => 'https://',
});

infScroll.on('scrollThreshold', async (e) => {
  // 이미 실행된 이벤트가 있을 때 막아주는 역할
  if(!infScroll.options.loadOnScroll) return;

  try {
    const loadingAnimation = container.appendChild(getLoadingAnimation().body.childNodes[0]);
    infScroll.option({loadOnScroll: false});
    const rawHtml = await getArticleList();
    if (rawHtml) {
      container.removeChild(loadingAnimation);
      appendElements(rawHtml);
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
    const rawHtml = await getArticleList();
    appendElements(rawHtml);
  } catch (error) {
    infScroll.destroy();
  }
})();
