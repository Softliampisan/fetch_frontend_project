import { useState, useEffect } from 'react';
import { Form, Button, Offcanvas } from 'react-bootstrap';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function Filter(props) {
    const { onFilterChange, showFilter, setShowFilter, filters, maxAge } = props;
    const [sortOrder, setSortOrder] = useState('asc');
    const [breed, setBreed] = useState('');
    const [ageRange, setAgeRange] = useState([0, maxAge]);
    const [zipCode, setZipCode] = useState('');

    // Sync filters prop when reopening the filter modal
    useEffect(() => {
        setSortOrder(filters.sortOrder);
        setBreed(filters.breed);
        setAgeRange([filters.minAge, filters.maxAge]);
        setZipCode(filters.zipCode);
    }, [filters]);

    const handleApplyFilters = () => {
        onFilterChange({ sortOrder, breed, minAge: ageRange[0], maxAge: ageRange[1], zipCode });
        setShowFilter(false);
    };

    const handleZipCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setZipCode(value.slice(0, 5)); // Limit to 5 characters
    };

    const handleBreedChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
        setBreed(value);
    };

    return (
        <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement='end'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Filter</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Sort By Breed</Form.Label>
                        <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value='asc'>Ascending</option>
                            <option value='desc'>Descending</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Search by Breed</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter breed...'
                            value={breed}
                            onChange={handleBreedChange}
                        />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Age Range: {ageRange[0]} - {ageRange[1]} years</Form.Label>
                        <Box sx={{ width: '100%' }}>
                            <Slider
                                value={ageRange}
                                onChange={(e, newValue) => setAgeRange(newValue)}
                                valueLabelDisplay='auto'
                                min={0}
                                max={maxAge}
                            />
                        </Box>
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Search by ZIP Code</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter ZIP code...'
                            value={zipCode}
                            onChange={handleZipCodeChange}
                        />
                    </Form.Group>

                    <Button variant='primary' className='w-100' onClick={handleApplyFilters}>Apply Filters</Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default Filter;
