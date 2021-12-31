
const { hostname, port } = window.location
// kakao //
let requestResult = null
let requestCookie = null
const baseURL = hostname === 'localhost' ? 'https://api-dev.rencar.co.kr' : 'https://apitest.rencar.co.kr'
const kakao = async () => {
  const cookieData = document.cookie.split(' ');
  const result = cookieData.filter(text => {
    const b = text.split('=');
    if (b[0] === 'staging-imsform-jwt' || b[0]=== 'development-imsform-jwt') {
      return b
    }
  })
  const rencarCookie = result[0].split('=')[1];
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `JWT ${rencarCookie}`
    },
  }

  const response = await fetch(`${baseURL}/v2/rent-company/auto-response/agree`, options)
  const responseJson = await response.json();
  requestResult = responseJson.policy_list
  requestCookie = rencarCookie
}


// kakao //

const dateParser = (date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const week = date.getDay()
  const weekStr = ['일', '월', '화', '수', '목', '금', '토'];

  return `${month} / ${day} (${weekStr[week]}) ${hour}:${minute}`
}


let platform = null
if (hostname === "staging.imsform.com" || port === "5500") {
  platform = "form"
}
if (hostname === "staging.rencar.co.kr" || port === "8100") {
  platform = "rencar"
}
let inputElements = [...document.querySelectorAll('[data-input]')];

const addFormatToExtension = ({ data, request, sendResponse }) => {
  inputElements = [...document.querySelectorAll('[data-input]')];
  const inputData = inputElements.map(input => {
    const key = input.dataset.input
    const value = input.value
    if (input.type === "radio" && input.checked) {
      return { [key]: value }
    }
    if (input.type === "radio" && !input.checked) return null
    if (input.innerText) {
      return { [key]: input.innerText }
    }
    if (input.value) {
      return { [key]: value }
    }
  })
  data.push({
    title: request.title, 
    inputData: inputData,
    date: dateParser(new Date()),
  });
  localStorage.setItem(request.storeKey, JSON.stringify(data))
  sendResponse({data: data})
}

const setFormatToBrowser = ({ request }) => {
  inputElements = [...document.querySelectorAll('[data-input]')];
  inputElements.map(input => {
    if (input.tagName === "P" && request.data[input.dataset.input]) {
      input.innerText = request.data[input.dataset.input]
      input.parentNode.dispatchEvent(new Event('click', { bubbles: true }))
      const a = [...input.parentNode.querySelectorAll('li')]
      a.map(li => {
        if (li.innerText === request.data[input.dataset.input]) {
          li.dispatchEvent(new Event('click', { bubbles: true }))
        }
      })
    }
    if (request.data[input.dataset.input]) {
      if (input.type === "radio") {
        if (input.value === request.data[input.dataset.input]) {
          input.checked = true
          input.dispatchEvent(new Event("click", { bubbles: true }));
          return
        }
      }
      input.setAttribute('value', request.data[input.dataset.input || ''])
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.dispatchEvent(new Event("blur", { bubbles: true }));
    }
  })
}

const cancelApi = async (id) => {
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `JWT ${requestCookie}`
    },
    body: JSON.stringify({agree: false})
  }
  
  const response = await fetch(`${baseURL}/v3/policy/kakao/${id}/agree`, options)
  const responseJson = await response.json();
  console.log(responseJson, 'cancel result')
}



chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    const data = JSON.parse(localStorage.getItem(request.storeKey)) || []
    if (request.action === "add") {
      return addFormatToExtension({
        data,
        request,
        sendResponse,
      })
    }
    if (request.action === "set") {
      setFormatToBrowser({
        request,
      })
      return 
    }
    if (request.action === "delete") {
      localStorage.setItem(request.storeKey, JSON.stringify(request.data))
    }
    // if (request.action === 'cancel') {
    //   sendResponse(requestResult)
    // }
    if (request.action === 'applyCancel') {
      await kakao()
      if (request.option === 'all') {
        cancelApi(requestResult[0].id)
        cancelApi(requestResult[1].id)
      } else {
        cancelApi(requestResult[1].id)
      }
      return 
    }
    sendResponse({
      platform: platform,
      data: data,
    })
  }
)
