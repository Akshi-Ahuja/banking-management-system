# Banking Management System

## Project Overview

This project is a **Banking Management System** developed as part of my internship task. The main objective of this project was to understand how a basic banking application works and to implement important banking operations using Java, Spring Boot, MySQL, and React.

The system allows customer information and bank accounts to be managed, and supports common banking operations such as deposit, withdrawal, fund transfer, transaction history, balance checking, and account statement generation.

Along with the admin-side management system, a simple customer portal has also been added where users can create their customer profile, open a bank account, and later access their account using their account number to perform banking operations.

---

## Task Requirements

The project was developed according to the assigned task requirements, which included:

- Use of Object-Oriented Programming concepts
- Exception handling
- Database integration using MySQL
- JDBC/JPA-based database operations
- Input validation
- Modular application structure
- Safe banking transaction processing

The system mainly covers:

### Customer Management

- Add a new customer
- View customer details
- Update customer information
- Search customers
- Deactivate customers
- Add and view customer document details

### Account Management

- Create a Savings or Current account
- View account details
- Search accounts
- Update account details
- Freeze an account
- Close an account
- Check account balance

### Banking Operations

- Deposit money
- Withdraw money
- Transfer money between accounts
- View transaction history
- Check balance
- Generate account statement

---

## Account Types

The system currently supports two account types:

### Savings Account

- Normal savings account
- Withdrawal cannot exceed the available account balance
- Overdraft facility is not allowed

### Current Account

- Supports normal banking operations
- Optional overdraft limit can be assigned
- Withdrawals can use the available overdraft limit

---

## Customer Portal

A basic customer-facing portal has also been included.

A new user can:

1. Create a customer profile
2. Receive a unique Customer ID
3. Open a Savings or Current account
4. Receive a unique Account Number
5. Access the account using the account number
6. Deposit money
7. Withdraw money
8. Transfer money
9. View transaction history
10. Generate account statements

The customer and account information is stored in the MySQL database, so the account can be accessed again later using the account number.

At the current stage, the project does not include login and authentication. Account access is currently based on the account number.

---

## Admin / Management Module

The project also contains a banking management dashboard for managing the overall system.

The admin-side interface provides access to:

- Customer records
- Customer documents
- Bank accounts
- Deposit transactions
- Withdrawal transactions
- Fund transfers
- Transaction history
- Account statements
- Banking dashboard information

---

## Customer Documents

The system allows document information to be stored for customers.

Supported document types include:

- PAN
- AADHAR
- Passport
- Driving License
- Voter ID
- Profile Photo

Currently, the system stores the **document file path and document information in the database**.

The actual document file upload functionality has not been implemented in the current version.

---

## Transfer Handling

For every transfer, two transaction records are maintained:

- `TRANSFER_OUT` for the sender account
- `TRANSFER_IN` for the receiver account

Both transaction records share the same `transferId`, which helps identify that they belong to the same transfer.

---

## Technologies Used

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Bean Validation
- MySQL
- Lombok
- Maven

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React

### Database

- MySQL

### Testing

- Postman
- Browser testing
- MySQL database verification

---

## Project Structure

```text
banking-management-system/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── data/
│   └── package.json
│
└── README.md
