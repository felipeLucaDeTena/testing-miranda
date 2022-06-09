export class Room {
    constructor({ name, bookings, rate, discount }) {
        this.name = name;
        this.bookings = bookings;
        this.rate = rate;
        this.discount = discount;
    }
    isOccupied(date) {
        const findBooking = this.bookings.find((booking) => {
            return new Date(date) >= new Date(booking.checkIn) &&
                new Date(date) <= new Date(booking.checkOut)
                ? booking
                : false;
        });
        return findBooking ? findBooking.name : false;
    }

    occupancyPercentage(startDate, endDate) {
        const oneDay = 1000 * 60 * 60 * 24;
        const numberofDaysOccupied = this.bookings
            .filter(
                (booking) =>
                    new Date(startDate) <= new Date(booking.checkIn) &&
                    new Date(endDate) >= new Date(booking.checkOut)
            )
            .map(
                (e) =>
                    (new Date(e.checkOut).getTime() -
                        new Date(e.checkIn).getTime()) /
                    oneDay
            )
            .reduce((a, b) => a + b, 0);
        const totalNumberDaysAvailable =
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            oneDay;
        const result = Math.round(
            (numberofDaysOccupied / totalNumberDaysAvailable) * 100
        );
        return result;
    }
}
export class Booking {
    constructor({ name, email, checkIn, checkOut, discount, room }) {
        this.name = name;
        this.email = email;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.discount = discount;
        this.room = room;
    }
    getFee() {
        const totalDiscount = (this.room.discount + this.discount) / 100;
        const Total =
            totalDiscount < 1
                ? this.room.rate - this.room.rate * totalDiscount
                : 0;
        return Math.round(Total.toFixed(2));
    }
}

export function totalOccupancyPercentage(rooms, startDate, endDate) {
    const percentageOfRoomsOccupied = rooms
        .map((room) => room.occupancyPercentage(startDate, endDate))
        .reduce((a, b) => a + b, 0);
    const result = Math.round(percentageOfRoomsOccupied / rooms.length);
    return result;
}

export function availableRooms(rooms, startDate, endDate) {
    const availableRoomArr = rooms.filter((room) =>
        room.bookings.find(
            (booking) =>
                new Date(startDate) <= new Date(booking.checkIn) &&
                new Date(endDate) >= new Date(booking.checkOut)
        )
    );
    return availableRoomArr[0]
        ? availableRoomArr.map((room) => room.name).join()
        : 'no rooms available';
}
