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
    if (confirm(`${list.title}을 삭제 하시겠습니까?`)) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "delete", storeKey: "register", data: restData}, function(res) {
          update(restData)
        });
      });
    }
  }
  
  return (
    <div className="list_wrap">
      {
        data.length === 0 &&
        <p className="empty_text">저장한 포맷이 없습니다.</p>
      }
      {
        data.map((list, i) => {
          return (
            <div key={i} className="card" onClick={(e) => {
              if (e.target.tagName !== 'BUTTON') {
                _handelClick(list)
              }
            }}>
              <p class="title">{list.title}</p>
              <p class="date">{list.date}</p>
              <button className="delete" onClick={() => _handleDelete(list)}>삭제</button>
            </div>
          )
        })
      }    
    </div>
  )
}
