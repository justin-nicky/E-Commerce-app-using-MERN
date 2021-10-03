import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <h5>Copyright &copy; Proshop</h5>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Footer
