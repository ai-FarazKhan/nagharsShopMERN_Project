import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = ({ match, history }) => {

    const userId = match.params.id

    const [name, setName] = useState('') // just an empty string as a default
    const [email, setEmail] = useState('') // just an empty string as a default
    const [isAdmin, setIsAdmin] = useState(false) // just an empty string as a default

    // lets define dispatch 
    const dispatch = useDispatch()

    
    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate

   // userId is coming from URL and we just wanna make sure if its matching the user._id if its doesn't or if its doesm't match the URL
    useEffect(() => {
        // checking success update, because if success update then we want to reset the user state, and then we wanna redirect to userList
        if(successUpdate){
            dispatch({type: USER_UPDATE_RESET})
            history.push('/admin/userlist')
        }
        else{
            if(!user.name || user._id !== userId){
                dispatch(getUserDetails(userId))
            }
            else{
                // if the user is already here, than set out fields.
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }

    }, [dispatch, history, userId, user, successUpdate]) 


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: userId, name, email, isAdmin }))
    }

    return (
        <>
            <Link to='/admin/userList' className='btn btn-light my-3'> Go Back</Link>
            <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='name' placeholder='Enter Email' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>
    
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
    
                    <Form.Group controlId='isAdmin'>
                        <Form.Check type='checkbox' label='Is Admin' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
                    </Form.Group>
    
                    <Button type='submit' variant='primary'>Update</Button>
    
                </Form>
            )}

        </FormContainer>            
        </>

    )
}

export default UserEditScreen
