console.log('%cContent', 'color: blue')

const dateParser = (date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const week = date.getDay()
  const weekStr = ['일', '월', '화', '수', '목', '금', '토'];

  return `${month} / ${day} (${weekStr[week]}) ${hour}:${minute}`
}

const { hostname, port } = window.location

let platform = null
if (hostname === "staging.imsform.com" || port === "5500") {
  platform = "form"
}
if (hostname === "staging.rencar.co.kr" || port === "8100") {
  platform = "rencar"
}
let inputElements = [...document.querySelectorAll('[data-input]')];

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const data = JSON.parse(localStorage.getItem(request.storeKey)) || []
    if (request.action === "add") {
      console.log('%cadd', "color: pink")
      inputElements = [...document.querySelectorAll('[data-input]')];
      // inputElements = [...inputElements, inputElements.filter(input => input.type === "radio" && input.checked)]
      const inputData = inputElements.map(input => {
        const key = input.dataset.input
        const value = input.value
        console.log(input.type)
        if (input.type === "radio" && input.checked) {
          return { [key]: value }
        }
        if (input.type === "radio" && !input.checked) return 
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
      return 
    }
    if (request.action === "set") {
      console.log('%cset', "color: green")
      inputElements = [...document.querySelectorAll('[data-input]')];
      inputElements.map(input => {
        if (input.tagName === "P" && request.data[input.dataset.input]) {
          // console.log(request.data[input.dataset.input])
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
      return 
    }
    if (request.action === "delete") {
      console.log('%cdelete', "color: red")
      localStorage.setItem(request.storeKey, JSON.stringify(request.data))
    }
    sendResponse({
      platform: platform,
      data: data,
    })
  }
)
