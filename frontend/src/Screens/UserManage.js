import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { listUsers, disableUser } from '../actions/userActions'
import Center from '../Components/Center'

const UserManage = ({ history }) => {
  const [modal, setModal] = useState({
    show: false,
    id: null,
    disable: null,
    name: null,
  })

  const dispatch = useDispatch()

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDisable = useSelector((state) => state.userDisable)
  const { success } = userDisable

  const toggleEnableDisable = (id, disable) => {
    dispatch(disableUser(id, disable))
  }

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, success])

  return (
    <>
      <Center>
        <h3>Users</h3>
      </Center>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr id='head'>
              <th>Name</th>
              <th>Email</th>
              <th>Block/Unblock</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              if (!user.isAdmin) {
                return (
                  <tr id={user._id}>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>
                      {user.isDisabled ? (
                        <Button
                          variant='secondary'
                          onClick={() => {
                            setModal({
                              show: true,
                              id: user._id,
                              disable: false,
                              name: user.name,
                            })
                          }}
                          style={{ width: '70px' }}
                        >
                          <i class='fas fa-user'></i>
                        </Button>
                      ) : (
                        <Button
                          variant='danger'
                          onClick={() => {
                            setModal({
                              show: true,
                              id: user._id,
                              disable: true,
                              name: user.name,
                            })
                          }}
                          style={{ width: '70px' }}
                        >
                          <i class='fas fa-user-slash'></i>
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              } else {
                return null
              }
            })}
          </tbody>
        </Table>
      )}

      <Modal
        show={modal.show}
        onHide={() => setModal({ ...modal, show: false })}
        size='sm'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body className='m-2'>
          {!modal.disable ? (
            <h5>Are you sure you want to unblock {modal.name}?</h5>
          ) : (
            <h5>Are you sure you want to block {modal.name}?</h5>
          )}
          <Center>
            <Button
              className='mx-3'
              variant='danger'
              onClick={() => {
                toggleEnableDisable(modal.id, modal.disable)
                setModal({ show: false, id: null, disable: null, name: null })
              }}
            >
              Yes
            </Button>
            <Button
              className='mx-3'
              variant='secondary'
              onClick={() =>
                setModal({ show: false, id: null, disable: null, name: null })
              }
            >
              Cancel
            </Button>
          </Center>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default UserManage
