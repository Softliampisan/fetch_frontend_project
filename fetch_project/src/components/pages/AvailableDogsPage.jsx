import { useState, useEffect } from 'react';
import { Button, Row, Pagination, Spinner } from 'react-bootstrap';
import Filter from '../Filter';
import DogCard from '../DogCard';

function AvailableDogsPage() {
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [savedDogIds, setSavedDogIds] = useState([]);
    const [maxAge, setMaxAge] = useState(14);
    const [filters, setFilters] = useState({
        breed: '',
        minAge: 0,
        maxAge: maxAge,
        sortOrder: 'asc',
        zipCode: ''
    });
    const [showFilter, setShowFilter] = useState(false);
    const [totalDogs, setTotalDogs] = useState(0);

    useEffect(() => {
        const savedDogs = JSON.parse(sessionStorage.getItem('savedDogIds')) || [];
        setSavedDogIds(savedDogs);
    }, []);

    // Fetch maxAge only once
    useEffect(() => {
        const fetchMaxAge = async () => {
            try {
                const searchResponse = await fetch(
                    `${API_BASE_URL}/dogs/search?sort=age:desc&size=1`,
                    { credentials: 'include' }
                );
                const searchData = await searchResponse.json();

                if (searchData.resultIds?.length === 0) {
                    console.error('No dog found.');
                    return;
                }

                const oldestDogId = searchData.resultIds[0];

                const dogsResponse = await fetch(`${API_BASE_URL}/dogs`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify([oldestDogId]),
                });

                const dogsData = await dogsResponse.json();
                if (dogsData.length > 0) {
                    setMaxAge(dogsData[0].age);
                }
            } catch (error) {
                console.error('Error fetching max age:', error);
            }
        };

        fetchMaxAge();
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchDogs = async () => {
            try {
                const { breed, minAge, maxAge, sortOrder, zipCode } = filters;
                const breedsResponse = await fetch(`${API_BASE_URL}/dogs/breeds`, {
                    credentials: 'include'
                });
                const validBreeds = await breedsResponse.json();

                const lowerCaseBreeds = validBreeds.map(b => b.toLowerCase());
                const userBreed = breed.toLowerCase();

                if (breed && !lowerCaseBreeds.includes(userBreed)) {
                    alert(`The breed '${breed}' does not exist. Please enter a valid breed.`);
                    setLoading(false);
                    return;
                }

                // Validate ZIP code (if provided)
                let zipFilter = '';
                if (zipCode) {
                    const zipValid = await validateZipCode(zipCode);
                    if (!zipValid) {
                        alert('Invalid ZIP code. Please enter a valid one.');
                        setLoading(false);
                        return;
                    }
                    zipFilter = `&zipCodes=${zipCode}`;
                }
                const page = (activePage - 1) * 25;
                const breedParam = breed
                    ? `&breeds=${encodeURIComponent(validBreeds.find(b => b.toLowerCase() === userBreed))}`
                    : '';

                const url = `${API_BASE_URL}/dogs/search?` +
                    `&sort=breed:${sortOrder}` +
                    `&from=${page}` +
                    breedParam +
                    `&ageMin=${minAge}` +
                    `&ageMax=${maxAge}` +
                    zipFilter;

                const response = await fetch(url, { credentials: 'include' });
                const data = await response.json();
                setTotalDogs(data.total);

                const dogIds = data.resultIds;
                if (dogIds.length === 0) {
                    alert('No dogs found with the selected filters. Please try different filters.');
                    resetFilters();
                    setDogs([]);
                    setNextPage(null);
                    setLoading(false);
                    return;
                }

                const dogsResponse = await fetch(`${API_BASE_URL}/dogs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(dogIds),
                });

                const dogData = await dogsResponse.json();
                setDogs(dogData);
                setNextPage(data.next);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dog details:', error);
                setLoading(false);
            }
        };

        fetchDogs();
    }, [activePage, filters]);


    const handleSaveClick = (dog) => {
        const newSavedDogIds = [...savedDogIds, dog.id];
        sessionStorage.setItem('savedDogIds', JSON.stringify(newSavedDogIds));
        alert(`${dog.name} has been added to your favorites!`);
        setSavedDogIds(newSavedDogIds);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setActivePage(1);
    };

    // Helper function to validate ZIP code
    const validateZipCode = async (zip) => {
        try {
            const response = await fetch(`${API_BASE_URL}/locations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify([zip]),
            });
            const data = await response.json();
            return data.length > 0;
        } catch (error) {
            console.error('Error validating ZIP code:', error);
            return false;
        }
    };

    // Reset filters in case of no results
    const resetFilters = () => {
        setFilters({ breed: '', minAge: 0, maxAge: maxAge, sortOrder: 'asc', zipCode: '' });
    };

    return (
        <div>
            {loading ? (
                <div className='loading-container'>
                    <Spinner animation='border' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <div>
                        <Button
                            variant='outline-secondary'
                            onClick={() => setShowFilter(true)}
                            className='filter-button'
                        >
                            Filter
                        </Button>
                        <h1 className='page-title'>Available Dogs</h1>
                    </div>

                    <Filter
                        showFilter={showFilter}
                        setShowFilter={setShowFilter}
                        onFilterChange={handleFilterChange}
                        filters={filters}
                        maxAge={maxAge} 
                    />

                    <Row className='justify-content-center'>
                        {dogs.map((dog) => (
                            <DogCard
                                key={dog.id}
                                dog={dog}
                                onButtonClick={handleSaveClick}
                                isFavorited={savedDogIds.includes(dog.id)}
                                buttonLabel={savedDogIds.includes(dog.id) ? 'Favorited' : 'Add to Favorites'}
                                buttonVariant='primary'
                            />
                        ))}
                    </Row>

                    {/* Pagination */}
                    {totalDogs > 0 && (
                        <Pagination className='d-flex justify-content-center'>
                            {activePage > 1 && <Pagination.Prev onClick={() => setActivePage(activePage - 1)} />}

                            {Array.from({ length: Math.min(5, Math.ceil(totalDogs / 25)) }).map((_, index) => {
                                const pageNumber = Math.max(1, activePage - 2) + index;
                                if (pageNumber > Math.ceil(totalDogs / 25)) return null;

                                return (
                                    <Pagination.Item
                                        key={pageNumber}
                                        active={pageNumber === activePage}
                                        onClick={() => setActivePage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Pagination.Item>
                                );
                            })}

                            {activePage < Math.ceil(totalDogs / 25) && <Pagination.Next onClick={() => setActivePage(activePage + 1)} />}
                        </Pagination>
                    )}
                </>
            )}
        </div>
    );
}

export default AvailableDogsPage;
