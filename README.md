# User Validation API (Development Version)

User Validation API is a web application backend built with Node.js that provides various user validation endpoints. This project is currently in development and some features may be underdeveloped or incomplete.

# Getting Started

To get started with User Validation API, you will need to have Node.js and npm installed on your computer. Once you have these dependencies, follow the steps below to install and run the project:

Clone this repository: git clone https://github.com/CNEK1/user-validation-api.git
Change into the project directory: cd user-validation-api
Install dependencies: npm install
Start the development server: npm start

# User Features

## User Registration

Users can register for an account on the application using the /registerByUser endpoint. The endpoint requires a UserRegisterDto object in the request body for validation. Once the user is registered, they can log in to access the application's features.

## Admin Registration

Admins can register for an account on the application using the /registerByAdmin endpoint. The endpoint requires a UserRegisterDto object in the request body for validation. Once the admin is registered, they can log in to access the application's features.

## User Login

Users can log in to the application using the /login endpoint. The endpoint requires a UserLoginDto object in the request body for validation. Once the user is authenticated, they can access the protected endpoints.

## User Information

Authenticated users can access their own information using the /info endpoint. The endpoint requires a GuardMiddleware for authentication.

## User Logout

Authenticated users can log out of the application using the /logout endpoint. The endpoint does not require any middleware.

## User Management

Admins can manage users in the application using various endpoints, including:

<ol>
<li>/: Get all users in the system</li>
<li>/delete/:id: Delete a user by ID</li>
<li>/update/:id: Update a user by ID. The endpoint requires a UserUpdateDto object in the request body for validation.</li>
<li>/:id: Get a user by ID</li>
<li>/detail/:id: Get detailed information about a user by ID</li>
</ol>
All endpoints that modify the user data require appropriate middleware for validation and authentication.

# Transaction Functionality

The User Validation API is complemented by a separate service that handles transaction operations. This service is encapsulated within the `TransactionService` class, which is part of the application's service layer.

## Overview

The `TransactionService` is responsible for all operations related to transactions between users. It utilizes the `TransactionRepository` to interact with the database and perform CRUD operations on transaction data.

## Service Methods

The service provides several methods to manage transactions:

- `createTransaction`: Creates a new transaction record.
- `getTransaction`: Retrieves a transaction by its ID.
- `getTransactions`: Fetches all transactions from the database.
- `updateTransaction`: Updates the status of an existing transaction.
- `deleteTransaction`: Deletes a transaction record.
- `getTransactionsByUserSend`: Gets all transactions initiated by a specific user.
- `getTransactionsByUserReceive`: Gets all transactions where the user is the receiver.

Each method corresponds to a specific endpoint in the API, allowing clients to perform transaction-related operations.

## Dependency Injection

The service uses dependency injection to obtain instances of the `TransactionRepository` and a logger utility, ensuring that the service is easily testable and maintainable.

## Transaction Model

Transactions are represented by the `TransactionModel`, which includes details such as sender ID, receiver ID, amount, and status.

## Usage

To use the transaction functionality, clients must interact with the exposed endpoints that the `TransactionService` backs. These endpoints require proper authentication and authorization to ensure secure access to transaction operations.

## Integration

This service is designed to work seamlessly with the User Validation API, providing a comprehensive backend solution for applications requiring user and transaction management.

# How to Contribute

Contributions to the transaction functionality are welcome. If you have ideas for improvements or have found a bug, please follow the contributing guidelines outlined in the main README section.

# Connected Services

The Transaction functionality is part of a larger ecosystem that includes the User Validation API and other connected services, such as the Study Hub application's backend.

For more information on how these services interact and how to contribute to the overall project, please refer to the connected repositories section.

# Contributing

If you would like to contribute to User Validation API, please feel free to fork the repository and submit a pull request. We welcome contributions of all kinds, including bug fixes, new features, and documentation improvements.

# Connected Repositories

Study Hub is also connected to another repository on GitHub. You can find this repository at the [following link](https://github.com/CNEK1/study-hub). This repository contains the backend code for the Study Hub application.

# License

This project is licensed under the MIT License - see the LICENSE file for details.
