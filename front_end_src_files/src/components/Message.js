import React from 'react'
import { Alert } from 'react-bootstrap'

// this is actually gonna pass in 2 props
const Message = ({ variant, children }) => {
    return (
        <Alert variant={variant}>
            {children}
        </Alert>
    )
}

Message.defaultProps = {
    variant: 'info', // its just a blue color

}

export default Message
