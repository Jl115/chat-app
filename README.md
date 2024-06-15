# LB-Chat Web Application

The LB-Chat web application includes an Ollama model that automatically installs in the background via Docker Compose. This allows the web application to be used initially. However, the AI chat functionality requires about 3 minutes before it can be used for the first time, as the model is approximately 2 GB in size. Otherwise, it might happen that no response is received from the AI.

## .env Variables

The variables defined in the `.env` file should be set as follows:

```
NAME=jl
SERVER_PORT=80
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
JWT_SECRET=
```

## Project Overview

Develop a chat application with a client, backend, and MariaDB or another system as the database/persistence layer, which can be made available as a distributed system in the form of containers. The app should allow users to exchange text messages in real time. Use proven methods and best practices for the development of distributed systems and ensure that the app is user-friendly and intuitive to use. Document your work and ensure that the app is tested and error-free before it is delivered to the company's employees.

## Components

The following describes the individual components of the distributed system and their respective functions.

### Client

The client of the LB-Chat application is a Vue.js application. It is statically delivered from the server upon the first visit to the website and subsequently handles routing and all visual elements of the application.

### Backend / API

The backend is a simple Node.js application using the Express.js web server framework. This choice was made due to familiarity and confidence in handling it, which enables rapid and productive development.

### Database

PostgreSQL was chosen as the database, considered to be the best option.

### Ollama

Ollama is a tool similar to Docker that enables the use of local large language models, which can then be communicated with via HTTP requests.

## Testing and Results

### Frontend

The frontend was tested using unit tests in a white-box manner. Various values were inputted to ensure that they are not erroneously stored in the database. This was successful as the client is only the visual interface and all inputs coming from the client are checked by default, as the client can never be fully trusted. Additionally, attempts were made to send messages without a token, or with expired or invalid tokens.

### Backend

The backend was developed with security in mind and therefore primarily needed to be tested in conjunction with the client.

### Pages and Tests

| Page                | Test Type                 | Description                                                                                                                                                    | Result                                                 |
|---------------------|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|
| Login Page          | Unit Tests (White-Box)    | Testing login functionality and input validation.                                                                                                              | Successful: Login functionality works correctly.       |
| Registration Page   | Unit Tests (White-Box)    | Checking the registration of new users and input validation.                                                                                                   | Successful: Users can register.                        |
| Chat Page           | Integration Tests         | Testing real-time communication and message transmission.                                                                                                      | Successful: Messages are transmitted in real time.     |
| Profile Page        | Functional Tests          | Checking profile data display and editing.                                                                                                                     | Successful: Profile data is displayed and edited correctly. |
| Chat Page           | Authentication Tests      | Attempts to send messages without a token, or with expired or invalid tokens.                                                                                   | Successful: Access denied as expected.                 |
| Backend API         | Security Tests            | Checking security measures to ensure the backend is protected against common attacks.                                                                          | Successful: Security measures are effective.           |
