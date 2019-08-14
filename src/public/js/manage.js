import { sendData } from "./util.js";

const DELETE_TASK = Symbol('delete task');
const MODIFY_BUTTON_CLICK = Symbol('click modify button');
const TITLE_MODIFY_TASK = Symbol('title modify');
const MARKDOWN_MODIFY_TASK = Symbol('markdown modify');
const HERO_IMAGE_MODIFY_TASK = Symbol('hero image modify');

const targetArticleIdInput = document.getElementById('target-article-id-input');
const titleInput = document.getElementById('modify-title-input');
const titleUploadButton = document.getElementById('modify-title-upload');
const mdFileInput = document.getElementById('modify-md-file-input');
const mdFileDisplay = document.getElementById('modify-md-file-display');
const mdFileUploadButton = document.getElementById('modify-md-file-upload');
const heroImageInput = document.getElementById('modify-hero-image-input');
const heroImageDisplay = document.getElementById('modify-hero-image-display');
const heroImageUploadButton = document.getElementById('modify-hero-image-upload');

document.querySelector('#manage-tbody').childNodes.forEach(
  row => row.addEventListener('click', async e => {
    try {
      const id = row.querySelector('.article-id').value;
      const title = row.querySelector('.article-title').innerText;
      if(e.task === DELETE_TASK) {
        const res = await sendData('DELETE', `/article/${id}`);
        if(res.status === 200) {
          location.reload();
        }
      } else if (e.task === MODIFY_BUTTON_CLICK) {
        titleInput.value = title;
        mdFileInput.value = heroImageInput.value = mdFileDisplay.value = heroImageDisplay.value = '';
        targetArticleIdInput.value = id;
      }
    } catch (error) {
      UIkit.notification('서버에 문제가 발생했습니다. 잠시 후 다시 실행해주세요.');
    }
  })
);

document.querySelectorAll('.article-delete-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.task = DELETE_TASK;
  });
});

document.querySelectorAll('.article-modify-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.task = MODIFY_BUTTON_CLICK;
  });
});

const markdownFileSelector = document.getElementById('modify-md-file-selector');
markdownFileSelector.addEventListener('click', e => {
  e.preventDefault();
  mdFileInput.click();
});

mdFileInput.addEventListener('change', e => {
  mdFileDisplay.value = e.target.files[0].name;
});

const heroImageSelector = document.getElementById('modify-hero-image-selector');
heroImageSelector.addEventListener('click', e => {
  e.preventDefault();
  heroImageInput.click();
});

heroImageInput.addEventListener('change', e => {
  heroImageDisplay.value = e.target.files[0].name;
});

titleUploadButton.addEventListener('click', e => {
  if(!titleInput.value) {
    e.stopPropagation();
    return;
  }
  e.task = TITLE_MODIFY_TASK;
});

mdFileUploadButton.addEventListener('click', e => {
  if(!mdFileInput.files) {
    e.stopPropagation();
    return;
  }
  e.task = MARKDOWN_MODIFY_TASK;
});
 
heroImageUploadButton.addEventListener('click', e => {
  if(!heroImageInput.files) {
    e.stopPropagation();
    return;
  }
  e.task = HERO_IMAGE_MODIFY_TASK;
});

document.getElementById('article-modify-form').addEventListener('click', async e => {
  try {
    const articleId = targetArticleIdInput.value;
    let res;
    if(e.task === TITLE_MODIFY_TASK) {
      if(!titleInput.value){
        UIkit.notification('제목을 입력하세요.', {status: 'danger'});
        return ;
      }
      res = await fetch(`/article/${articleId}/title`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({title: titleInput.value })
      });
    } else if (e.task === MARKDOWN_MODIFY_TASK) {
      if(!mdFileInput.files.length){
        UIkit.notification('마크다운 파일을 선택한 다음 진행해주세요.', {status: 'danger'});
        return ;
      }
      const data = new FormData();
      data.append('markdown', mdFileInput.files[0]);
      res = await fetch(`/article/${articleId}/markdown`, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json' },
        body: data,
      });
    } else if (e.task === HERO_IMAGE_MODIFY_TASK) {
      if(!heroImageInput.files.length){
        UIkit.notification('이미지를 선택한 다음 진행해주세요.', {status: 'danger'});
        return ;
      }
      const data = new FormData();
      data.append('heroimage', heroImageInput.files[0]);
      res = await fetch(`/article/${articleId}/heroimage`, {
        method: 'PATCH',
        body: data,
      });
    } else {
      return;
    }
    
    if(res.status === 200) {
      location.reload();
    } else {
      const json = await res.json();
      UIkit.notification(json.message, {status: 'danger'});
    }
  } catch (error) {
    UIkit.notification('서버에 문제가 발생하여 업데이트하지 못했습니다.', {status: 'danger'});
  }
});
