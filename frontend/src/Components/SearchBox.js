import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }
  return (
    <>
      <Form onSubmit={submitHandler} inline className='ps-3'>
        <Row>
          <Col>
            <Form.Control
              type='text'
              name='q'
              placeholder='Search...'
              className='mr-sm-2 ml-sm-5'
              onChange={(e) => setKeyword(e.target.value)}
            ></Form.Control>
          </Col>
          <Col>
            <Button
              type='submit'
              className='pt-2 pb-2'
              variant='outline-success'
            >
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default SearchBox
