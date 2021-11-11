import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { listAllOrders } from '../actions/orderActions'
import Center from '../Components/Center'

const OrderManage = ({ history }) => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderList = useSelector((state) => state.orderList)
  const { loading, orders, error } = orderList

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listAllOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  return (
    <>
      <Center>
        <h3>Orders</h3>
      </Center>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr id='head'>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr id={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>₹{order.totalPrice}</td>

                  <td>
                    {order.isPaid ? (
                      // order.paidAt.substring(0, 10)
                      <i
                        className='fas fa-check'
                        style={{ color: 'green' }}
                      ></i>
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>{order.status}</td>

                  <LinkContainer to={`/order/${order._id}`}>
                    <Button
                      variant='secondary'
                      className='btn-sm text-dark mx-2'
                    >
                      Details
                    </Button>
                  </LinkContainer>
                </tr>
              )
            })}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderManage
