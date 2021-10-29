import React from 'react'
import { Nav } from 'react-bootstrap'

const Sidebar = () => {
  return (
    <>
      <Nav defaultActiveKey='/home' className='flex-column pt-3'>
        <h6>Manage</h6>
        <Nav.Link eventKey='link-1'>Link</Nav.Link>
        <Nav.Link eventKey='link-2'>Link</Nav.Link>
        <Nav.Link eventKey='disabled' disabled>
          Disabled
        </Nav.Link>
      </Nav>
    </>
  )
}

export default Sidebar
