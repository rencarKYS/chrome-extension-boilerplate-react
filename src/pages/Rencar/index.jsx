import React from 'react'
import './Rencar.css';

export default function Rencar({
  addForm
}) {
  return (
    <div>
      <button onClick={addForm}>추가</button>
    </div>
  )
}
