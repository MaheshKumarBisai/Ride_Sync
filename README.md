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

## Database Reset

To clear all data from the database, run the following command from the `backend` directory:

```bash
npm run reset-db
```

## AWS S3 Setup (for Production)

For production, this application uses AWS S3 for image storage. You will need to create an S3 bucket and provide the necessary credentials in the `backend/.env` file.

1.  **Create an S3 Bucket:**
    -   Log in to your AWS Management Console and navigate to the S3 service.
    -   Create a new bucket and give it a unique name.
    -   Make sure to set the bucket's permissions to allow public read access.

2.  **Get AWS Credentials:**
    -   Navigate to the IAM service in your AWS console.
    -   Create a new user with programmatic access.
    -   Attach the `AmazonS3FullAccess` policy to the user.
    -   Copy the `Access key ID` and `Secret access key`.

3.  **Update `.env` file:**
    -   Add the following variables to your `backend/.env` file:
        ```
        AWS_ACCESS_KEY_ID=your-access-key-id
        AWS_SECRET_ACCESS_KEY=your-secret-access-key
        S3_BUCKET_NAME=your-s3-bucket-name
        ```
    **Note:** To enable S3 storage, you must also set the `NODE_ENV` environment variable to `production` in your production environment.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.