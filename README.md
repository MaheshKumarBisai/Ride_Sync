# RideSync - Vehicle Rental Application

This is a full-stack vehicle rental application that allows users to rent vehicles from vendors. Vendors can manage their vehicles and bookings, and users can browse and book vehicles based on their location.

## Features

- **Dynamic Content:** Vendors see only their own vehicles and bookings. Users see vehicles available in their city.
- **Image Uploads:** Vendors can upload images of their vehicles.
- **Responsive UI:** The application is designed to be responsive and work on all screen sizes.
- **Role-Based Access Control:** The application has different roles for customers, vendors, and admins.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Make sure you have a running instance of MongoDB)

### Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ridesync.git
    cd ridesync
    ```

2.  **Setup the Backend:**

    -   Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    -   Install the dependencies:
        ```bash
        npm install
        ```
    -   Create a `.env` file in the `backend` directory and add the following environment variables:
        ```
        MONGODB_URI=mongodb://localhost:27017/ridesync-enhanced
        FRONTEND_URL=http://localhost:3000
        ```
    -   Start the backend server:
        ```bash
        npm start
        ```
    The backend server should now be running on `http://localhost:4000`.

3.  **Setup the Frontend:**

    -   Navigate to the `frontend` directory:
        ```bash
        cd ../frontend
        ```
    -   Install the dependencies:
        ```bash
        npm install
        ```
    -   Start the frontend development server:
        ```bash
        npm start
        ```
    The frontend application should now be running on `http://localhost:3000`.

## Usage

1.  **Register as a Vendor:**
    -   Navigate to `http://localhost:3000/register?role=vendor` and create a new vendor account.
2.  **Add a Vehicle:**
    -   Log in as the vendor and navigate to the dashboard.
    -   Click on "Add Vehicle" and fill in the details.
3.  **Register as a Customer:**
    -   Navigate to `http://localhost:3000/register?role=customer` and create a new customer account.
4.  **Book a Vehicle:**
    -   Log in as the customer and browse the available vehicles.
    -   Select a vehicle and book it for your desired dates.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.