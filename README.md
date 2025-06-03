# Patient Tracker App

## Overview

Patient Tracker App is a comprehensive RESTful API designed to streamline the management of patient-doctor appointments, consultations, and communications. The application supports multiple user roles (patients, doctors, and admins), real-time chat, appointment scheduling, notifications, and prescription management. Built with Node.js and MongoDB, it ensures secure authentication and efficient data handling for healthcare workflows.

---

## Features

- **User Authentication & Authorization**
  - Secure registration and login for patients, doctors, and admins
  - JWT-based authentication
  - Role-based access control

- **Appointment Management**
  - Patients can book, view, and cancel appointments
  - Doctors can manage their appointment schedules
  - Admins can oversee all appointments

- **Real-Time Chat**
  - Secure messaging between patients and doctors

- **Notifications**
  - Email notifications for account creation, appointment reminders, and password resets

- **Prescription & Consultation Management**
  - Doctors can create and manage prescriptions and consultation notes for patients

- **Profile Management**
  - Users can update their personal and medical information

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer
- **Real-Time:** Socket.io (for chat)
- **Testing:** Jest, Supertest

---

## Folder Structure

```
patient_tracker_app/
│
├── controllers/      # Business logic for each route
├── models/           # Mongoose schemas and models
├── routes/           # Express route definitions
├── middleware/       # Custom middleware (auth, error handling, etc.)
├── config/           # Configuration files (DB, email, etc.)
├── utils/            # Utility functions (email, validators, etc.)
├── tests/            # Unit and integration tests
├── app.js            # Main Express app
├── server.js         # Entry point
└── README.md         # Project documentation
```

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB

### Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/patient_tracker_app.git
   cd patient_tracker_app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and update the values as needed.

4. **Start the server:**
   ```
   npm start
   ```

5. **Run tests:**
   ```
   npm test
   ```

---

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Appointments

- `GET /api/appointments` — List appointments (role-based)
- `POST /api/appointments` — Book an appointment
- `DELETE /api/appointments/:id` — Cancel an appointment

### Chat

- `GET /api/chat/:userId` — Get chat history
- `POST /api/chat/:userId` — Send a message

### Prescriptions

- `GET /api/prescriptions/:patientId` — View prescriptions
- `POST /api/prescriptions` — Create a prescription (doctor only)

### Users

- `GET /api/users/me` — Get current user profile
- `PUT /api/users/me` — Update profile

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please contact [NGodwill](mailto:nyonggodwill11@gmail.com).