const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Prince007@',
    database: 'testdb'
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Database connected");

    // Users Table
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
    )`;

    // Buses Table
    const createBusesTable = `
    CREATE TABLE IF NOT EXISTS Buses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        busNumber VARCHAR(20) NOT NULL UNIQUE,
        totalSeats INT NOT NULL,
        availableSeats INT NOT NULL
    )`;

    // Bookings Table
    const createBookingsTable = `
    CREATE TABLE IF NOT EXISTS Bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        bus_id INT NOT NULL,
        seatNumber VARCHAR(10) NOT NULL,
        bookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id),
        FOREIGN KEY (bus_id) REFERENCES Buses(id)
    )`;

    // Payments Table
    const createPaymentsTable = `
    CREATE TABLE IF NOT EXISTS Payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        amountPaid DECIMAL(10,2) NOT NULL,
        paymentStatus ENUM('Pending','Success','Failed') NOT NULL,
        paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES Bookings(id)
    )`;

    connection.execute(createUsersTable, (err) => {
        if (err) return console.log(err);
        console.log("Users table created");
    });

    connection.execute(createBusesTable, (err) => {
        if (err) return console.log(err);
        console.log("Buses table created");
    });

    connection.execute(createBookingsTable, (err) => {
        if (err) return console.log(err);
        console.log("Bookings table created");
    });

    connection.execute(createPaymentsTable, (err) => {
        if (err) return console.log(err);
        console.log("Payments table created");
    });
});
module.exports=connection;