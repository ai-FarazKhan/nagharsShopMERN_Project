import React from 'react'
import { useDispatch,useSelector } from 'react-redux'// now we have to bring our user login State into this component, so whenever we wanna bringin anything from redux state, for this we need to bring useDispatch and useSelector. If you wanna call an action then use useDispatch, and when if you want to bring something in then you use useSelector. In this case we wanna do both, we want a logIn action and we want the userLogin State.
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'
import { Route } from 'react-router-dom'


const Header = () => {

  const dispatch = useDispatch()

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin


  // is tarhan hum jaisai hi user apni profile update karayga toh usi waqt Header main jo name woh bhi change hojaiga. lekin jab paga reload karaingain toh signIn likha wa ajaiga. yeh masla hai is main bas.
  // const userUpdateProfile = useSelector(state => state.userUpdateProfile)
  // const { userInfo } = userUpdateProfile

 

  const logoutHandler = () => {
    dispatch(logout())
  }


    return (
        <header>
        <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
        <Container>
        <LinkContainer to='/'>
          <Navbar.Brand>Naghars Shop</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Route render={({ history }) => <SearchBox history={history} />} />
          <Nav className="ml-auto">
          
          <LinkContainer to='/cart'>
            <Nav.Link ><i className='fas fa-shopping-cart'></i>Cart</Nav.Link>
          </LinkContainer>
            
          {userInfo ? (
            <NavDropdown title={userInfo.name}  id='username'>
              <LinkContainer to='/profile'>
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : 
            <LinkContainer to='/login'>
              <Nav.Link><i className='fas fa-user'></i>Sign In</Nav.Link>
            </LinkContainer>
        
          }

          {userInfo && userInfo.isAdmin && (
            <NavDropdown title='Admin'  id='adminmenu'>
              <LinkContainer to='/admin/userlist'>
                <NavDropdown.Item>Users</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to='/admin/productlist'>
                <NavDropdown.Item>Products</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to='/admin/orderlist'>
                <NavDropdown.Item>Orders</NavDropdown.Item>
              </LinkContainer>
              
            </NavDropdown>            
          )}


          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
        </header>
    )
}

export default Header
