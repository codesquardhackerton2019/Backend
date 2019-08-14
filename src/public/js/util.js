export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  return strongRegex.test(password);
}

export async function sendData(method = 'POST', url = '', data = {}) {
  try {
    const res = await fetch(url, { method,
        mode: 'cors', 
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', 
        body: JSON.stringify(data), 
    });

    return res;
  } catch (error) {
    throw error;
  } 
}

export async function sendGetOrHead(method = 'GET', url = '') {
  try {
    const res = await fetch(url, { method,
        mode: 'cors', 
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', 
    });

    return res;
  } catch (error) {
    throw error;
  } 
}


export function setEventIfElementExist(element, eventName, callback) {
  if (element) {
    element.addEventListener(eventName, callback);
  }
}

export const domParser = new DOMParser();
const loadingAnimationStr = `<div class="loader-ellips">
<span class="loader-ellips__dot"></span>
<span class="loader-ellips__dot"></span>
<span class="loader-ellips__dot"></span>
<span class="loader-ellips__dot"></span>
</div>`;
export const getLoadingAnimation = () => domParser.parseFromString(loadingAnimationStr, 'text/html');
