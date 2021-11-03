import React, {useState} from 'react';
import Rencar from '../Rencar';
import './style.css';

const Popup = () => {
  // const test = () => {
    // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, {action: "START"}, /* callback */);
    // });
  // }
  const [currentTab, setCurrentTab] = useState('rencar');
  const _addForm = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "add"}, /* callback */);
    });
  }

  const _tabClick = (e) => {
    const selectTab = e.target.dataset.tab
    setCurrentTab(selectTab)
  }

  const isSelectTab = (target) => {
    if (currentTab === target) {
      return 'on'
    }
    return ''
  }

  const contents = () => {
    switch(currentTab) {
      case 'rencar' : return <Rencar addForm={_addForm} />
      case 'form' : return <div>form</div>
      case 'admin' : return <div>admin</div>
      default : break;
    }
  }

  return (
    <div className="App">
      {/* <button onClick={test}>click</button> */}
      <div className="tab">
        <ul onClick={_tabClick}>
          <li className={isSelectTab('rencar')} data-tab="rencar">렌카</li>
          <li className={isSelectTab('form')} data-tab="form">IMSForm</li>
          <li className={isSelectTab('admin')} data-tab="admin">Admin</li>
        </ul>
      </div>
      <div className="contents">
        {contents()}
      </div>
    </div>
  );
};

export default Popup;
