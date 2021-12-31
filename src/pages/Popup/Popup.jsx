import React, {useState, useEffect} from 'react';
import Rencar from '../Rencar';
import './style.css';

const Popup = () => {
  const [currentTab, setCurrentTab] = useState('rencar');
  const [formTitle, setFormTitle] = useState(null);
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    tabInit()
  }, [])

  const queryCallbackTab = (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {storeKey: "register"}, (res) => {
      setCurrentTab(res?.platform || 'rencar')
      setFormList(res?.data || [])
    })
  }


  const queryCallbackAddForm = (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "add", storeKey: "register", title: formTitle}, function(res) {
      setFormList(res.data)
      setFormTitle('')
    });
  }

  const tabInit = () => {
    chrome.tabs.query({active: true, currentWindow: true}, queryCallbackTab);
  }


  
  const _addForm = (e) => {
    e.preventDefault()
    const overlapCheck = formList.filter(list => list.title === formTitle);
    if (overlapCheck.length > 0) { 
      alert('동일한 이름으로 등록된 데이터가 있습니다.')
      return
    }
    chrome.tabs.query({active: true, currentWindow: true}, queryCallbackAddForm);
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
      default : break;
    }
  }


  const kakaoSuggestCancelBtn = (option) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "applyCancel", storeKey: "kakaoCancel", option: option}, function(res) {
        // console.log(res)
      });
    });
  }

  const renderAgree = () => {
    return (
      <>
        <button onClick={() => kakaoSuggestCancelBtn('all')}>전체 동의 취소</button>
        <button onClick={() => kakaoSuggestCancelBtn('one')}>신규 정책 동의 취소</button>
      </>
    )
  }


  return (
    <div className="App">
      <div className="tab">
        <ul onClick={_tabClick}>
          <li className={isSelectTab('rencar')} data-tab="rencar">렌카</li>
          <li className={isSelectTab('form')} data-tab="form">IMSForm</li>
          <li className={isSelectTab('agree')} data-tab="agree">정책 동의 취소</li>
        </ul>
      </div>
      <div className="contents">
        {
          currentTab !== 'agree' ? (
            <>
              <form onSubmit={_addForm}>
                <input 
                  onChange={(e) => setFormTitle(e.target.value)} 
                  placeholder="포맷 이름을 정해주세요" 
                  type="text"
                  value={formTitle || ''}
                />
                <button>추가</button>
              </form>
              {contents()}
            </>
          ) : renderAgree()
        }
      </div>
    </div>
  );
};

export default Popup;
