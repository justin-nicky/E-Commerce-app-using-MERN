import React from 'react'
import { Col, Row } from 'react-bootstrap'
import products from '../products'
import Product from '../Components/Product'

const HomeScreen = () => {
  return (
    <>
      <h3>Latest products</h3>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default HomeScreen
