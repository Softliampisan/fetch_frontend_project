import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';

function DogCard(props) {
    const { dog, onButtonClick, isFavorited, buttonLabel, buttonVariant, hideButton = false } = props;
    return (
        <Col xs={12} sm={6} md={4} lg={3} className='mb-4 d-flex justify-content-center dog-card-container'>
            <Card className='dog-card'>
                <Card.Img variant='top' src={dog.img} className='dog-card-img' />
                <Card.Body>
                    <Card.Title className='dog-card-title'>{dog.name}</Card.Title>
                    <Card.Text className='dog-card-text'>
                        <span>Breed:</span> {dog.breed} <br />
                        <span>Age:</span> {dog.age} years <br />
                        <span>Zip Code:</span> {dog.zip_code}
                    </Card.Text>
                    {!hideButton && (
                        <Button
                            variant={buttonVariant}
                            className='full-width-button'
                            onClick={() => onButtonClick(dog)}
                            disabled={isFavorited && buttonVariant === 'primary'}
                        >
                            {buttonLabel}
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
}

export default DogCard;
