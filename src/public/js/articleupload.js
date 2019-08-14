const markdownFileSelector = document.getElementById('md-file-selector');
const markdownFileDisplay = document.getElementById('md-file-display');
const markdownFileInput = document.getElementById('md-file-input');
const heroImageSelector = document.getElementById('hero-image-selector');
const heroImageDisplay = document.getElementById('hero-image-display');
const heroImageInput = document.getElementById('hero-image-input');
const titleInput = document.getElementById('title-input');
const articleUploadForm = document.getElementById('markdown-upload-form').childNodes[0];

markdownFileSelector.addEventListener('click', e => {
  e.preventDefault();
  markdownFileInput.click();
});

markdownFileInput.addEventListener('change', e => {
  markdownFileDisplay.value = e.target.files[0].name;
});

heroImageSelector.addEventListener('click', e => {
  e.preventDefault();
  heroImageInput.click();
});

heroImageInput.addEventListener('change', e => {
  heroImageDisplay.value = e.target.files[0].name;
});

document.getElementById('article-upload-btn').addEventListener('click', e => {
  e.preventDefault();
  if(!(markdownFileInput.value && heroImageInput.value && titleInput.value)) {
    UIkit.notification('제목과 대표 이미지, 마크다운 파일이 모두 필요합니다.', {status: 'danger'});
    return;
  }
  articleUploadForm.submit();
});
