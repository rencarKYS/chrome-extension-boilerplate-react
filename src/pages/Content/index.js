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
      const inputData = inputElements.map(input => {
        const key = input.dataset.input
        const value = input.value
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
          console.log(request.data[input.dataset.input])
          input.innerText = request.data[input.dataset.input]
          input.parentNode.dispatchEvent(new Event('click', { bubbles: true }))
          const a = [...input.parentNode.children[2].querySelectorAll('li')]
          a.map(li => {
            if (li.innerText === request.data[input.dataset.input]) {
              li.dispatchEvent(new Event('click', { bubbles: true }))
            }
          })
        }
        if (request.data[input.dataset.input]) {
          input.setAttribute('value', request.data[input.dataset.input])
          input.dispatchEvent(new Event("change", { bubbles: true }));
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


// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (request.action === "add") {
//       console.log(333)
//       // sendResponse({platform: platform})
//     }
//   }
// )
// import { printLine } from './modules/print';
// console.log('Content script works!');
// console.log('Must reload extension for modifications to take effect.');

// const idCheck = [...document.querySelectorAll('input')]
// const customerData = [
//   { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
//   { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
// ];

// const DATABASE = "IMSForm"
// const DB_VERSION = 1
// const DB_STORE_NAME = "normal_register"
// let db = null

// const openDb = () => {
//   // db 생성
//   const request = window.indexedDB.open(DATABASE, DB_VERSION);
//   // DB 생성 성공
//   request.onsuccess = function(e) {
//     db = this.result
//   }
//   // DB 생성실패
//   request.onerror = function(e) {
//     console.error(`indexDB : ${e.target.errorCode}`)
//   }
// }

// openDb()

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (request.action === "add") {
      
//       // console.log(idCheck)
//       // const request = window.indexedDB.open("request");
//       // request.onerror = function (e) {
//       //   alert('error')
//       // }
//       // request.onsuccess = function (e) {
//       //   console.log(request.result)
//       // }
//       // request.onupgradeneeded = function(event) {
//       //   const db = event.target.result
//       //   const objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
//       //   objectStore.createIndex("name", "name", { unique: false });
//       //   objectStore.createIndex("email", "email", { unique: true });
//       //   objectStore.transaction.oncomplete = function(event) {
//       //     // Store values in the newly created objectStore.
//       //     var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
//       //     customerData.forEach(function(customer) {
//       //       customerObjectStore.add(customer);
//       //     });
//       //     console.log(customerObjectStore)
//       //   };
//       // }
//     }
//   }
// );


// printLine("Using the 'printLine' function from the Print Module");

