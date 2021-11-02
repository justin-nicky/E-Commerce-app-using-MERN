import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {
  Card,
  Col,
  Container,
  Row,
  Image,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap'
import Loader from '../Components/Loader'
import { populateDashboard } from '../actions/dashboardActions'
import LineChart from '../Components/LineChart'
import DoughnutChart from '../Components/DoughnutChart'
import Center from '../Components/Center'
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
} from '@react-pdf/renderer'
import SalesReport from '../Components/SalesReport'

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
  }, [dispatch])

  const showDownloadButton = (type) => {
    const orders =
      type === 'weekly'
        ? data?.ordersOfLastWeek
        : type === 'monthly'
        ? data?.ordersOfLastMonth
        : data?.ordersOfLastYear
    return (
      <PDFDownloadLink
        document={<SalesReport orders={orders} />}
        fileName={`${type} Sales Report.pdf`}
      >
        {type}
      </PDFDownloadLink>
    )
  }

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
                  <Card.Text>Rs. {data?.totalSales}</Card.Text>
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
                  <Card.Text> {data?.orderCount}</Card.Text>
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
                  <Card.Text> {data?.productCount}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card style={{ width: '19rem', margin: '.5rem' }}>
            <Card.Body>
              <Row>
                {data ? (
                  <>
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
                      <Card.Text> {data?.userCount}</Card.Text>
                    </Col>
                  </>
                ) : (
                  <Loader />
                )}
              </Row>
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <Col md={9}></Col>
          <Col md={2} className='mt-3'>
            <DropdownButton
              id='dropdown-basic-button'
              title='Download Sales Report'
            >
              <Dropdown.Item as='button'>
                {showDownloadButton('weekly')}
              </Dropdown.Item>
              <Dropdown.Item as='button'>
                {showDownloadButton('monthly')}
              </Dropdown.Item>
              <Dropdown.Item as='button'>
                {showDownloadButton('yearly')}
              </Dropdown.Item>
            </DropdownButton>
          </Col>
        </Row>

        <Row className='mt-2'>
          <Col md={8} className='p-2'>
            <LineChart dataFromParent={data?.salesOfLastWeek} />
          </Col>
          <Col md={4} fluid={true} className='p-5'>
            <Center>
              <h5>Popular Payment Methods</h5>
            </Center>
            <DoughnutChart dataFromParent={data?.paymentMethods} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AdminDashboard
