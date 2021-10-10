import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions'

const Header = () => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar bg='light' expand='lg' collapseOnSelect>
        <Container>
          {userInfo?.isAdmin ? (
            <>
              <LinkContainer to='/admin'>
                <Navbar.Brand>PROSHOP DASHBOARD</Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='ms-auto'>
                  <NavDropdown title='Manage' id='username'>
                    <LinkContainer to='/manageproducts'>
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/manageusers'>
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/manageorders'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/managecategories'>
                      <NavDropdown.Item>Categories</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                  <LinkContainer to='/'>
                    <Nav.Link onClick={logoutHandler}>
                      LOGOUT <i className='fas fa-sign-out-alt'></i>
                    </Nav.Link>
                  </LinkContainer>
                </Nav>
              </Navbar.Collapse>
            </>
          ) : (
            <>
              <LinkContainer to='/'>
                <Navbar.Brand>PROSHOP</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='ms-auto'>
                  <LinkContainer to='/cart'>
                    <Nav.Link>
                      <i className='fas fa-shopping-cart'></i> CART
                    </Nav.Link>
                  </LinkContainer>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id='username'>
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <LinkContainer to='/login'>
                      <Nav.Link>
                        {' '}
                        <i className='fas fa-user'></i> LOGIN
                      </Nav.Link>
                    </LinkContainer>
                  )}
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
