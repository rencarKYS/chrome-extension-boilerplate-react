import { printLine } from './modules/print';
console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const idCheck = [...document.querySelectorAll('input')]
const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "add") {
      console.log(idCheck)
      const request = window.indexedDB.open("request");
      request.onerror = function (e) {
        alert('error')
      }
      request.onsuccess = function (e) {
        console.log(request.result)
      }
      request.onupgradeneeded = function(event) {

      }
    }
  }
);


printLine("Using the 'printLine' function from the Print Module");

