import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {
  Card,
  Col,
  Modal,
  Button,
  Container,
  Row,
  Image,
  DropdownButton,
  Dropdown,
  Form,
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

  const [modalShow, setModalShow] = useState(false)
  const [dates, setDates] = useState({
    startDate: '',
    endDate: '',
  })
  const [showDownloadComponent, setShowDownloadComponent] = useState(false)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [salesReportInARange, setSalesReportInARange] = useState({})

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

  const showDownloadButton = (type, dates) => {
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

  const fetchSalesReport = async (startDate, endDate) => {
    //fetch sales report in a range
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    }

    const { data } = await axios.get(
      `/api/dashboard/salesreport/${startDate}/${endDate}`,
      config
    )
    setSalesReportInARange(data)
    setShowDownloadComponent(true)
    setModalShow(false)
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
                  <Image src='/rupee.png' roundedCircle fluid />
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
                  <Image src='/delivery-van.png' roundedCircle fluid />
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
                  <Image src='/product.png' fluid />
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
                      <Image src='/usericon.png' fluid />
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
              <Dropdown.Item
                as='button'
                onClick={() => {
                  setModalShow(true)
                }}
              >
                Custom Range
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

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body className='m-2'>
          <Modal.Title id='contained-modal-title-vcenter'>
            {' '}
            Choose Dates
          </Modal.Title>

          <Form
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <Form.Group className='mb-3' controlId='formBasicDate'>
              <Form.Label>Start Date: </Form.Label>
              <input
                type='datetime-local'
                required
                className='mx-3 '
                max={new Date().toISOString().split('.')[0]}
                onChange={(e) => {
                  setDates({ ...dates, startDate: e.target.value })
                }}
              ></input>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicDate'>
              <Form.Label>End Date: </Form.Label>
              <input
                type='datetime-local'
                required
                className='mx-3 '
                onChange={(e) => {
                  setDates({ ...dates, endDate: e.target.value })
                }}
                max={new Date().toISOString().split('.')[0]}
                min={dates.startDate}
              ></input>
            </Form.Group>

            <Center>
              {(dates.startDate !== '' || dates.endDate !== '') && (
                <Button
                  className='mx-3'
                  type='submit'
                  variant='primary'
                  onClick={() => {
                    fetchSalesReport(dates.startDate, dates.endDate)
                  }}
                >
                  Generate Report
                </Button>
              )}
              <Button
                className='mx-3'
                variant='secondary'
                onClick={() => {
                  setModalShow(false)
                }}
              >
                Cancel
              </Button>
            </Center>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showDownloadComponent}
        onHide={() => setShowDownloadComponent(false)}
        size='sm'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body className='m-2'>
          <PDFDownloadLink
            as='button'
            document={<SalesReport orders={salesReportInARange} />}
            fileName={`Sales Report.pdf`}
          >
            Download Report
          </PDFDownloadLink>
          <Button
            className='mx-3'
            variant='secondary'
            onClick={() => {
              setShowDownloadComponent(false)
            }}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AdminDashboard
