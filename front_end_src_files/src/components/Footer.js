import React from 'react'
import { Container, Row, Col, Nav } from 'react-bootstrap';

const Footer = () => {
    return (

        <footer>

        <Container>
            <Row>
                <Col className='text-center py-3'>
                {(new Date().getFullYear())}  Copyright &copy; Naghars Shop <br/> <Nav.Link href="https://s3.amazonaws.com/farazkhan.dev/my+CV/index.html">Developed By Mr.Faraz Khan</Nav.Link>
                </Col>
            </Row>
        </Container>
        </footer>
    )
}

export default Footer
