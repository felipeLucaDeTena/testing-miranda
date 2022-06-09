import {
    Room,
    Booking,
    totalOccupancyPercentage,
    availableRooms,
} from './index.js';

const mockRoom = {
    name: 'Deluxe Suite',
    bookings: [],
    rate: 100,
    discount: 0,
};
const mockBooking = {
    name: 'Felipe Luca',
    email: 'Felipeluca@gmail.com',
    checkIn: '2022-03-1',
    checkOut: '2022-03-15',
    discount: 0,
    room: { ...mockRoom },
};
describe('Class Room', () => {
    describe('Method Room isOccupied', () => {
        test('There are no bookings', () => {
            const room = new Room({ ...mockRoom });
            room.bookings = [];
            const value = room.isOccupied('2022-01-18');
            expect(value).toBeFalsy();
        });
        test('If the room not occupied return falsey', () => {
            const room = new Room({ ...mockRoom });
            room.bookings = [mockBooking];
            const value = room.isOccupied('2022-01-18');
            expect(value).toBeFalsy();
        });
        test('If the room is occupied return guest name', () => {
            const room = new Room({ ...mockRoom });
            room.bookings = [mockBooking];
            const value = room.isOccupied('2022-03-1');
            expect(value).toBe(mockBooking.name);
        });
    });
    describe('Method Room occupancyPercentage', () => {
        test('returns the percentage of days with occupancy within the range of dates provided => 100%', () => {
            const room = new Room({ ...mockRoom });
            room.bookings = [
                { ...mockBooking },
                {
                    ...mockBooking,
                    checkIn: '2022-03-15',
                    checkOut: '2022-03-31',
                },
            ];
            const value = room.occupancyPercentage('2022-03-1', '2022-03-31');
            expect(value).toBe(100);
        });
        test('returns the percentage of days with occupancy within the range of dates provided => 25%', () => {
            const room = new Room({ ...mockRoom });
            room.bookings = [
                {
                    ...mockBooking,
                    checkIn: '2022-03-01',
                    checkOut: '2022-03-03',
                },
                {
                    ...mockBooking,
                    checkIn: '2022-03-03',
                    checkOut: '2022-03-04',
                },
            ];
            const value = room.occupancyPercentage('2022-03-01', '2022-03-13');
            expect(value).toBe(25);
        });
        test('returns the percentage of days with occupancy within the range of dates provided => 0%', () => {
            const room = new Room({ ...mockRoom });
            room.bookings = [
                {
                    ...mockBooking,
                    checkIn: '2022-06-01',
                    checkOut: '2022-06-03',
                },
                {
                    ...mockBooking,
                    checkIn: '2022-06-03',
                    checkOut: '2022-06-04',
                },
            ];
            const value = room.occupancyPercentage('2022-03-01', '2022-03-13');
            expect(value).toBe(0);
        });
    });
});
describe('Class Booking', () => {
    describe('Method getFee', () => {
        test('returns total price after room discount is applied 50% =>', () => {
            const room = new Room({
                ...mockRoom,
                rate: 100,
                bookings: [],
                discount: 50,
            });
            const booking = new Booking({
                discount: 0,
                room: room,
            });
            room.bookings.push(booking);
            expect(booking.getFee()).toBe(50);
        });
        test('returns total price after discount is applied 150% (negative discount)=>', () => {
            const room = new Room({
                ...mockRoom,
                bookings: [],
                discount: 100,
            });
            const booking = new Booking({
                discount: 50,
                room: room,
            });
            room.bookings.push(booking);
            expect(booking.getFee()).toBe(0);
        });
        test('returns total price after room discount 10% & booking discount 15% is applied=>', () => {
            const room = new Room({
                ...mockRoom,
                bookings: [],
                discount: 10,
            });
            const booking = new Booking({
                discount: 15,
                room: room,
            });
            room.bookings.push(booking);
            expect(booking.getFee()).toBe(75);
        });
        test('returns total price after booking discount 10% is applied=>', () => {
            const room = new Room({
                ...mockRoom,
                bookings: [],
            });
            const booking = new Booking({
                discount: 10,
                room: room,
            });
            room.bookings.push(booking);
            expect(booking.getFee()).toBe(90);
        });
    });
});
describe('External Functions', () => {
    const bookings1 = [
        {
            ...mockBooking,
            checkIn: '2022-03-01',
            checkOut: '2022-03-03',
        },
        {
            ...mockBooking,
            checkIn: '2022-03-10',
            checkOut: '2022-03-20',
        },
    ];
    const bookings2 = [
        {
            ...mockBooking,
            checkIn: '2022-04-01',
            checkOut: '2022-04-06',
        },
        {
            ...mockBooking,
            checkIn: '2022-04-06',
            checkOut: '2022-04-16',
        },
    ];
    describe('Function TotalOccupancyPercentage', () => {
        test('returns the total occupancy percentage across all rooms in the array => 0%', () => {
            const room1 = new Room({ ...mockRoom });
            room1.bookings = bookings1;
            const room2 = new Room({ ...mockRoom });
            room2.bookings = bookings2;
            const rooms = [room1, room2];

            const value = totalOccupancyPercentage(
                rooms,
                '2022-08-01',
                '2022-08-05'
            );
            expect(value).toBe(0);
        });
        test('returns the total occupancy percentage across all rooms in the array => 25%', () => {
            const room1 = new Room({ ...mockRoom });
            room1.bookings = bookings1;
            const room2 = new Room({ ...mockRoom });
            room2.bookings = bookings2;
            const rooms = [room1, room2];

            const value = totalOccupancyPercentage(
                rooms,
                '2022-04-01',
                '2022-05-01'
            );
            expect(value).toBe(25);
        });
    });
    describe('Method availableRooms', () => {
        test('returns all rooms in the array that are not occupied for the entire duration=> 1', () => {
            const room1 = new Room({ ...mockRoom });
            room1.bookings = bookings1;
            const room2 = new Room({ ...mockRoom });
            room2.bookings = bookings2;
            const rooms = [room1, room2];

            const value = availableRooms(rooms, '2022-03-10', '2022-03-25');
            expect(value).toBe('Deluxe Suite');
        });
        test('returns the percentage of days with occupancy within the range of dates provided => 0', () => {
            const room1 = new Room({ ...mockRoom });
            room1.bookings = bookings1;
            const room2 = new Room({ ...mockRoom });
            room2.bookings = bookings2;
            const rooms = [room1, room2];

            const value = availableRooms(rooms, '2022-08-10', '2022-08-25');
            expect(value).toBe('no rooms available');
        });
    });
});
