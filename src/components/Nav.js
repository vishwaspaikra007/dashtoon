import React from 'react'
import './Nav.css'

export default function Nav(props) {
    const {edit, setEdit} = props
  return (
    <div className='Nav'>
        <button className='Edit' onClick={e => setEdit(!edit)}>
            {edit ? 'Read': 'Edit'}
        </button>
    </div>
  )
}
