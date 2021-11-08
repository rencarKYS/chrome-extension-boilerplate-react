import React, {useState, useEffect} from 'react';
import Rencar from '../Rencar';
import './style.css';

const Popup = () => {
  // const test = () => {
    // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, {action: "START"}, /* callback */);
    // });
  // }
  const [currentTab, setCurrentTab] = useState('rencar');
  const [formTitle, setFormTitle] = useState(null);
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    tabInit()
    
  }, [])

  const tabInit = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {storeKey: "register"}, function(res) {
        console.log(res)
        setCurrentTab(res.platform)
        setFormList(res.data)
      });
    });
  }
  
  const _addForm = (e) => {
    e.preventDefault()
    const overlapCheck = formList.filter(list => list.title === formTitle);
    if (overlapCheck.length > 0) { 
      alert('동일한 이름으로 등록된 데이터가 있습니다.')
      return
    }
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "add", storeKey: "register", title: formTitle}, function(res) {
        setFormList(res.data)
        setFormTitle('')
      });
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
      case 'rencar' : return <Rencar update={setFormList} data={formList} />
      case 'form' : return <Rencar update={setFormList} data={formList} />
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
        <form onSubmit={_addForm}>
          <input 
            onChange={(e) => setFormTitle(e.target.value)} 
            placeholder="제목" 
            type="text"
            value={formTitle}
          />
          <button>추가</button>
        </form>
        {contents()}
      </div>
    </div>
  );
};

export default Popup;
