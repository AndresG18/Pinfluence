# Pinfluence

**Inspired by the immense popularity and innovative features of Pinterest, Pinfluence aims to replicate the core functionalities of Pinterest while providing a unique user experience focused on seamless interaction and real-time updates. Pinfluence is designed to be a highly interactive single-page application that enhances user engagement through a visually appealing interface and advanced features.**

### Key Features:
- **Real-Time Messaging**: Implemented WebSockets using Flask-SocketIO on the backend and socket.io-client on the frontend for real-time messaging between followers and their following, allowing seamless communication without refreshing the page.
- **Efficient Deployment**: Deployed with Docker and AWS S3 for efficient data handling and environment consistency, ensuring a highly reliable and maintainable application infrastructure.
- **Dynamic UI with React and Redux**: Designed a visually appealing, responsive user interface using React and Redux, integrating modern UX/UI principles and utilizing Figma for precise wireframe designs, resulting in a seamless and engaging user experience with efficient state management.
- **CRUD Functionalies**: Developed extensive CRUD functionalities for pins, boards, and profiles, including advanced features for user follows, search for pins/users, and board saves, ensuring robust content management capabilities that enhance user engagement and retention.
- **Search and Filter**: Integrated search and filter features, significantly improving user experience by allowing users to find and categorize content efficiently.
- **Pins**: Each pin can be magnified for a detailed view, and users can download images directly from the platform.
- **Live messaging(WebSockets)**: Ensured seamless communication between 2 users by implementing web sockets for a better user experience.
# Flask React Project
## Technologies 
![](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)  ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![SQLite](https://img.shields.io/badge/Sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white) ![Python](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white) ![](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white) ![](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

This is the starter for the Flask React project.
## DB Schema
![Screenshot 2024-05-28 at 5 07 16 PM](https://github.com/AndresG18/Pinfluence/assets/143563900/6e211f91-bff0-47ab-8d38-dc498695309d)

### Setting Up AWS If not yet setup

For detailed instructions on setting up AWS for deployment, refer to the [AWS Setup Guide](https://github.com/appacademy/Module-6-Resources/tree/3b472f95180110edd49a2352937622bbd6a25054/group_project_resources/AWS).

This guide will walk you through:
 **Creating and Configuring AWS S3 Buckets**: For storing static assets like images.
Follow the instructions in the provided link to ensure your application is set up correctly on AWS.

### Getting Started
#Clone the project
Install dependencies
- run 'pipenv install -r requirements.txt' in the root project folder
- run 'npm install' in react-vite folder
- Create and ensure that the .env file has the following fields
- SECRET_KEY
- DATABASE_URL
- SCHEMA
- S3_BUCKET
- S3_KEY
- S3_SECRET
## Migration
 - run 'pipenv run flask db upgrade' in the root project folder
- run 'pipenv flask seed all'
## Start up the servers
- run 'pipenv run flask run' in the root project folder
- run 'npm run dev' in react-vite folder
# Backend API-Routes 🚙

This web app uses the following API routes to dynamically update the page to create a single-page-app-like feel for the user for specific features.

## User Authentication/Authorization 👥

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

- **Request:** endpoints that require authentication
- **Error Response:** Require authentication
  - **Status Code:** 401
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the correct role(s) or permission(s).

- **Request:** endpoints that require proper authorization
- **Error Response:** Require proper authorization
  - **Status Code:** 403
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

- **Require Authentication:** false
- **Request:**
  - **Method:** GET
  - **URL:** `/api/session`
  - **Body:** none
- **Successful Response when there is a logged in user:**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```
- **Successful Response when there is no logged in user:**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's information.

- **Require Authentication:** false
- **Request:**
  - **Method:** POST
  - **URL:** `/api/session`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```
- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```
- **Error Response: Invalid credentials**
  - **Status Code:** 401
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "Invalid credentials"
    }
    ```
- **Error Response: Body validation errors**
  - **Status Code:** 400
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current user's information.

- **Require Authentication:** false
- **Request:**
  - **Method:** POST
  - **URL:** `/api/users`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```
- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```
- **Error Response: User already exists with the specified email**
  - **Status Code:** 500
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists"
      }
    }
    ```
- **Error Response: User already exists with the specified username**
  - **Status Code:** 500
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "User already exists",
      "errors": {
        "username": "User with that username already exists"
      }
    }
    ```
- **Error Response: Body validation errors**
  - **Status Code:** 400
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "first_name": "First Name is required",
        "last_name": "Last Name is required"
      }
    }
    ```

## Pin Routes

### Create a Pin

Creates a new pin and returns the created pin's information.

- **Request:**
  - **Method:** POST
  - **URL:** `/api/pins`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "title": "My New Pin",
      "content_url": "http://example.com/image.jpg",
      "description": "Description of my new pin",
      "link": "link.com",
      "user_id": 1,
      "board_id": 1
    }
    ```
- **Successful Response:**
  - **Status Code:** 201
  - **Body:**
    ```json
    {
      "id": 1,
      "title": "My New Pin",
      "content_url": "http://example.com/image.jpg",
      "description": "Description of my new pin",
      "link": "link.com",
      "user_id": 1,
      "board_id": 1
    }
    ```
- **Error Response:**
  - **Status Code:** 400
  - **Body:**
    ```json
    {
      "message": "Bad Request"
    }
    ```

### Get All Pins

Returns a list of all pins.

- **Request:**
  - **Method:** GET
  - **URL:** `/api/pins`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 200
  - **Body:**
    ```json
    [
      {
        "id": 1,
        "title": "My New Pin",
        "content_url": "http://example.com/image.jpg",
        "description": "Description of my new pin",
        "link": "link.com",
        "user_id": 1,
        "board_id": 1
      }
    ]
    ```

### Get a Pin by ID

Returns details of a specific pin by ID.

- **Request:**
  - **Method:** GET
  - **URL:** `/api/pins/:id`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 200
  - **Body:**
    ```json
    {
      "id": 1,
      "title": "My New Pin",
      "content_url": "http://example.com/image.jpg",
      "description": "Description of my new pin",
      "link": "link.com",
      "user_id": 1,
      "board_id": 1
    }
    ```
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Pin not found"
    }
    ```

### Update a Pin

Updates a pin's information and returns the updated pin.

- **Request:**
  - **Method:** PUT
  - **URL:** `/api/pins/:id`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "title": "Updated Pin Title",
      "content_url": "http://example.com/image.jpg",
      "description": "Updated description",
      "link": "link.com"
    }
    ```
- **Successful Response:**
  - **Status Code:** 200
  - **Body:**
    ```json
    {
      "id": 1,
      "title": "Updated Pin Title",
      "content_url": "http://example.com/image.jpg",
      "description": "Updated description",
      "link": "link.com",
      "user_id": 1,
      "board_id": 1
    }
    ```
- **Error Response:**
  - **Status Code:** 400
  - **Body:**
    ```json
    {
      "message": "Bad Request"
    }
    ```

### Delete a Pin

Deletes a pin by ID.

- **Request:**
  - **Method:** DELETE
  - **URL:** `/api/pins/:id`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 204
  - **Body:** none
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Pin not found"
    }
    ```

## Board Routes

### Get All Boards

Returns a list of all boards.

- **Request:**
  - **Method:** GET
  - **URL:** `/api/boards`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 200
  - **Body:**
    ```json
    [
      {
        "id": 1,
        "name": "My Board",
        "description": "Description of my board",
        "user_id": 1
      }
    ]
    ```

### Get a Board by ID

Returns details of a specific board by ID.

- **Request:**
  - **Method:** GET
  - **URL:** `/api/boards/:id`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 200
  - **Body:**
    ```json
    {
      "id": 1,
      "name": "My Board",
      "description": "Description of my board",
      "user_id": 1
    }
    ```
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Board not found"
    }
    ```

### Create a New Board

Creates a new board and returns the created board's information.

- **Request:**
  - **Method:** POST
  - **URL:** `/api/boards`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "name": "New Board",
      "description": "Description of new board",
      "user_id": 1
    }
    ```
- **Successful Response:**
  - **Status Code:** 201
  - **Body:**
    ```json
    {
      "id": 2,
      "name": "New Board",
      "description": "Description of new board",
      "user_id": 1
    }
    ```
- **Error Response:**
  - **Status Code:** 400
  - **Body:**
    ```json
    {
      "message": "Bad Request"
    }
    ```

### Update a Board

Updates a board's information and returns the updated board.

- **Request:**
  - **Method:** PUT
  - **URL:** `/api/boards/:id`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "name": "Updated Board Name",
      "description": "Updated description"
    }
    ```
- **Successful Response:**
  - **Status Code:** 200
  - **Body:**
    ```json
    {
      "id": 1,
      "name": "Updated Board Name",
      "description": "Updated description",
      "user_id": 1
    }
    ```
- **Error Response:**
  - **Status Code:** 400
  - **Body:**
    ```json
    {
      "message": "Bad Request"
    }
    ```

### Delete a Board

Deletes a board by ID.

- **Request:**
  - **Method:** DELETE
  - **URL:** `/api/boards/:id`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 204
  - **Body:** none
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Board not found"
    }
    ```

## Like Routes

### Like a Pin

Likes a pin.

- **Request:**
  - **Method:** POST
  - **URL:** `/api/pins/:pin_id/like`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 201
  - **Body:** none
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Pin not found"
    }
    ```

### Unlike a Pin

Unlikes a pin.

- **Request:**
  - **Method:** DELETE
  - **URL:** `/api/pins/:pin_id/unlike`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 204
  - **Body:** none
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Pin not found"
    }
    ```

## Comment Routes

### Create a Comment

Adds a comment to a pin.

- **Request:**
  - **Method:** POST
  - **URL:** `/api/pins/:pin_id/comments`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "content": "My new comment"
    }
    ```
- **Successful Response:**
  - **Status Code:** 201
  - **Body:** none
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Pin not found"
    }
    ```

### Get All Comments of a Pin

Returns all comments of a pin.

- **Request:**
  - **Method:** GET
  - **URL:** `/api/pins/:pin_id/comments`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 200
  - **Body:**
    ```json
    [
      {
        "id": 1,
        "content": "My new comment",
        "timestamp": "2024-05-28T12:00:00Z",
        "user_id": 1,
        "pin_id": 1
      }
    ]
    ```

### Get a Comment by ID

Returns a specific comment by its ID.

- **Request:**
  - **Method:** GET
  - **URL:** `/api/comments/:comment_id`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 200
  - **Body:**
    ```json
    {
      "id": 1,
      "content": "My new comment",
      "timestamp": "2024-05-28T12:00:00Z",
      "user_id": 1,
      "pin_id": 1
    }
    ```
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Comment not found"
    }
    ```

### Update a Comment

Updates an existing comment.

- **Request:**
  - **Method:** PUT
  - **URL:** `/api/comments/:comment_id`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "content": "Updated comment"
    }
    ```
- **Successful Response:**
  - **Status Code:** 200
  - **Body:** none
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Comment not found"
    }
    ```

### Delete a Comment

Deletes an existing comment.

- **Request:**
  - **Method:** DELETE
  - **URL:** `/api/comments/:comment_id`
  - **Headers:**
    - `Content-Type: application/json`
- **Successful Response:**
  - **Status Code:** 200
  - **Body:** none
- **Error Response:**
  - **Status Code:** 404
  - **Body:**
    ```json
    {
      "message": "Comment not found"
    }
    ```
