import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Col, Container, Row, Image } from 'react-bootstrap'
import { populateDashboard } from '../actions/dashboardActions'

const AdminDashboard = () => {
  const dispatch = useDispatch()

  const dashboardPopulate = useSelector((state) => state.dashboardPopulate)
  const {
    loading: dashboardLoading,
    data,
    error: dashboardError,
  } = dashboardPopulate

  useEffect(() => {
    if (data) {
      console.log(data)
    } else {
      dispatch(populateDashboard())
    }
  }, [])

  return (
    <>
      <Container>
        <Row>
          <Card style={{ width: '19rem', margin: '.5rem' }}>
            <Card.Body>
              <Row>
                <Col
                  md={3}
                  className='d-block align-items-center justify-content-center'
                >
                  <Image
                    src='/rupee.png'
                    roundedCircle
                    fluid
                    //className='d-block align-items-center justify-content-center'
                  />
                </Col>
                <Col md={9}>
                  <Card.Title>Total Sales</Card.Title>
                  <Card.Text>Rs. {data.totalSales}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card style={{ width: '19rem', margin: '.5rem' }}>
            <Card.Body>
              <Row>
                <Col
                  md={3}
                  className='d-block align-items-center justify-content-center'
                >
                  <Image
                    src='/delivery-van.png'
                    roundedCircle
                    fluid
                    //className='d-block align-items-center justify-content-center'
                  />
                </Col>
                <Col md={9}>
                  <Card.Title>Total Orders</Card.Title>
                  <Card.Text> {data.orderCount}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card style={{ width: '19rem', margin: '.5rem' }}>
            <Card.Body>
              <Row>
                <Col
                  md={3}
                  className='d-block align-items-center justify-content-center'
                >
                  <Image
                    src='/product.png'
                    fluid
                    //className='d-block align-items-center justify-content-center'
                  />
                </Col>
                <Col md={9}>
                  <Card.Title>Total Products</Card.Title>
                  <Card.Text> {data.productCount}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card style={{ width: '19rem', margin: '.5rem' }}>
            <Card.Body>
              <Row>
                <Col
                  md={3}
                  className='d-block align-items-center justify-content-center'
                >
                  <Image
                    src='/usericon.png'
                    fluid
                    //className='d-block align-items-center justify-content-center'
                  />
                </Col>
                <Col md={9}>
                  <Card.Title>Total Users</Card.Title>
                  <Card.Text> {data.userCount}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  )
}

export default AdminDashboard
