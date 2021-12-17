import React from 'react'
import './Rencar.css';

export default function Rencar({
  data,
  update
}) {

  const _handelClick = (list) => {
    list.inputData.map(item => {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "set", data: item});
      });
    })
  }

  const _handleDelete = (list) => {
    const restData = data.filter(item => item.title !== list.title);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "delete", storeKey: "register", data: restData}, function(res) {
        update(restData)
      });
    });
  }
  
  return (
    <div className="list_wrap">
      {
        data.map((list, i) => {
          return (
            <div key={i} className="card" onClick={(e) => {
              console.log(e.target.tagName)
              if (e.target.tagName !== 'BUTTON') {
                _handelClick(list)
              }
            }}>
              <p>{list.title}</p>
              <p>{list.date}</p>
              <button className="delete" onClick={() => _handleDelete(list)}>삭제</button>
            </div>
          )
        })
      }    
    </div>
  )
}
