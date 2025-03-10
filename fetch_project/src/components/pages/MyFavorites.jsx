import { useState, useEffect } from 'react';
import { Button, Row, Modal, Spinner } from 'react-bootstrap';
import DogCard from '../DogCard';

function MyFavorites() {
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const [favoriteDogsData, setFavoriteDogsData] = useState([]);
    const [savedDogIds, setSavedDogIds] = useState([]);
    const [matchedDog, setMatchedDog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedDogIds = JSON.parse(sessionStorage.getItem('savedDogIds')) || [];
        setSavedDogIds(savedDogIds);

        if (savedDogIds.length > 0) {
            fetch(`${API_BASE_URL}/dogs`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savedDogIds),
            })
                .then(response => response.json())
                .then(data => setFavoriteDogsData(data))
                .catch(error => console.error('Error fetching favorite dogs:', error))
                .finally(() => setLoading(false)); // Stop loading after fetch
        } else {
            setLoading(false); // No dogs, stop loading immediately
        }
    }, []);

    const handleUnselectClick = (dog) => {
        const updatedSavedDogIds = savedDogIds.filter(id => id !== dog.id);
        const updatedFavoriteDogs = favoriteDogsData.filter(favDog => favDog.id !== dog.id);
        setSavedDogIds(updatedSavedDogIds);
        setFavoriteDogsData(updatedFavoriteDogs);
        sessionStorage.setItem('savedDogIds', JSON.stringify(updatedSavedDogIds));
        alert(`${dog.name} has been removed from your favorites!`);
    };

    const handleFindMatch = async () => {
        if (savedDogIds.length === 0) {
            alert('You need at least one favorite dog to find a match!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/dogs/match`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savedDogIds),
            });

            if (!response.ok) throw new Error('Failed to fetch match');

            const { match } = await response.json();
            const matchedDogData = favoriteDogsData.find(dog => dog.id === match);

            if (matchedDogData) {
                setMatchedDog(matchedDogData);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error finding match:', error);
            alert('Something went wrong while finding your match!');
        }
    };

    return (
        <div>
            {!loading && savedDogIds.length === 0 && (
                <h1 className='text-center mt-4'>Add some dogs to your favorites!</h1>
            )}
            
            {loading && (
                <div className='d-flex justify-content-center my-4'>
                    <Spinner animation='border' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </Spinner>
                </div>
            )}

            {favoriteDogsData.length > 0 && (
                <>
                    <h1 className='text-center mt-4'>Your Favorite Dogs</h1>
                    <div className='d-flex justify-content-center my-3'>
                        <Button variant='success' onClick={handleFindMatch}>Find Your Match</Button>
                    </div>
                </>
            )}

            <Row className='justify-content-center'>
                {favoriteDogsData.map((dog) => (
                    <DogCard
                        key={dog.id}
                        dog={dog}
                        onButtonClick={handleUnselectClick}
                        buttonLabel='Remove from Favorites'
                        buttonVariant='danger'
                    />
                ))}
            </Row>
            {/* Match Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>You've Been Matched!</Modal.Title>
                </Modal.Header>
                {matchedDog && (
                    <Modal.Body className='d-flex justify-content-center'>
                        <DogCard dog={matchedDog} hideButton={true} />
                    </Modal.Body>
                )}
            </Modal>

        </div>
    );
}

export default MyFavorites;
