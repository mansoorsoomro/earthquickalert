// Mock emergency resources data

import { EmergencyResource } from '@/lib/types/emergency'

export const mockHospitals: EmergencyResource[] = [
    {
        id: 'hosp-1',
        type: 'hospital',
        name: 'San Francisco General Hospital',
        location: {
            lat: 37.7562,
            lng: -122.4206,
            address: '1001 Potrero Ave, San Francisco, CA 94110',
        },
        status: 'available',
        capacity: 500,
        currentOccupancy: 350,
        contact: '(415) 206-8000',
        hours: '24/7',
    },
    {
        id: 'hosp-2',
        type: 'hospital',
        name: 'UCSF Medical Center',
        location: {
            lat: 37.7625,
            lng: -122.4580,
            address: '505 Parnassus Ave, San Francisco, CA 94143',
        },
        status: 'available',
        capacity: 600,
        currentOccupancy: 480,
        contact: '(415) 476-1000',
        hours: '24/7',
    },
    {
        id: 'hosp-3',
        type: 'hospital',
        name: 'California Pacific Medical Center',
        location: {
            lat: 37.7886,
            lng: -122.4324,
            address: '2333 Buchanan St, San Francisco, CA 94115',
        },
        status: 'limited',
        capacity: 400,
        currentOccupancy: 380,
        contact: '(415) 600-6000',
        hours: '24/7',
    },
]

export const mockShelters: EmergencyResource[] = [
    {
        id: 'shelter-1',
        type: 'shelter',
        name: 'Lincoln Community Center',
        location: {
            lat: 37.7749,
            lng: -122.4294,
            address: '1234 Lincoln Way, San Francisco, CA 94122',
        },
        status: 'available',
        capacity: 200,
        currentOccupancy: 45,
        contact: '(415) 555-0100',
        hours: 'Open during emergencies',
    },
    {
        id: 'shelter-2',
        type: 'shelter',
        name: 'Riverside High School',
        location: {
            lat: 37.7649,
            lng: -122.4394,
            address: '5678 Riverside Dr, San Francisco, CA 94102',
        },
        status: 'available',
        capacity: 300,
        currentOccupancy: 120,
        contact: '(415) 555-0200',
        hours: 'Open during emergencies',
    },
    {
        id: 'shelter-3',
        type: 'shelter',
        name: 'Bayview Community Center',
        location: {
            lat: 37.7349,
            lng: -122.3994,
            address: '9101 Bayview Ave, San Francisco, CA 94124',
        },
        status: 'full',
        capacity: 150,
        currentOccupancy: 150,
        contact: '(415) 555-0300',
        hours: 'Open during emergencies',
    },
]

export const mockMedicalClinics: EmergencyResource[] = [
    {
        id: 'clinic-1',
        type: 'medical-clinic',
        name: 'Pop-Up Medical Clinic - Downtown',
        location: {
            lat: 37.7849,
            lng: -122.4094,
            address: 'Market St & 5th St, San Francisco, CA 94103',
        },
        status: 'available',
        contact: '(415) 555-0400',
        hours: '8 AM - 8 PM',
    },
    {
        id: 'clinic-2',
        type: 'medical-clinic',
        name: 'Pop-Up Medical Clinic - Mission District',
        location: {
            lat: 37.7599,
            lng: -122.4148,
            address: '24th St & Mission St, San Francisco, CA 94110',
        },
        status: 'available',
        contact: '(415) 555-0500',
        hours: '8 AM - 8 PM',
    },
]

export const mockFEMALocations: EmergencyResource[] = [
    {
        id: 'fema-1',
        type: 'fema',
        name: 'FEMA Assistance Center - City Hall',
        location: {
            lat: 37.7794,
            lng: -122.4193,
            address: '1 Dr Carlton B Goodlett Pl, San Francisco, CA 94102',
        },
        status: 'available',
        contact: '1-800-621-3362',
        hours: '9 AM - 6 PM',
    },
    {
        id: 'fema-2',
        type: 'fema',
        name: 'FEMA Assistance Center - Civic Center',
        location: {
            lat: 37.7799,
            lng: -122.4177,
            address: '355 McAllister St, San Francisco, CA 94102',
        },
        status: 'available',
        contact: '1-800-621-3362',
        hours: '9 AM - 6 PM',
    },
]

export const mockRedCrossStations: EmergencyResource[] = [
    {
        id: 'redcross-1',
        type: 'red-cross',
        name: 'Red Cross Relief Station - North',
        location: {
            lat: 37.7999,
            lng: -122.4294,
            address: '2700 Turk Blvd, San Francisco, CA 94118',
        },
        status: 'available',
        contact: '1-800-RED-CROSS',
        hours: '24/7',
    },
    {
        id: 'redcross-2',
        type: 'red-cross',
        name: 'Red Cross Relief Station - South',
        location: {
            lat: 37.7449,
            lng: -122.4194,
            address: '1234 Silver Ave, San Francisco, CA 94134',
        },
        status: 'available',
        contact: '1-800-RED-CROSS',
        hours: '24/7',
    },
]

export const mockFoodBanks: EmergencyResource[] = [
    {
        id: 'food-1',
        type: 'food-bank',
        name: 'Community Food Pantry',
        location: {
            lat: 37.7649,
            lng: -122.4494,
            address: '567 Hayes St, San Francisco, CA 94102',
        },
        status: 'available',
        contact: '(415) 555-0600',
        hours: '10 AM - 4 PM',
    },
]

export const allMockResources: EmergencyResource[] = [
    ...mockHospitals,
    ...mockShelters,
    ...mockMedicalClinics,
    ...mockFEMALocations,
    ...mockRedCrossStations,
    ...mockFoodBanks,
]
