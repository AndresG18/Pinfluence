# Pinfluence

**Inspired by the immense popularity and innovative features of Pinterest, Pinfluence aims to replicate the core functionalities of Pinterest while providing a unique user experience focused on seamless interaction and real-time updates. Pinfluence is designed to be a highly interactive single-page application that enhances user engagement through a visually appealing interface and advanced features.**

**Unlike the complexity often found in larger social media platforms, Pinfluence focuses on delivering an intuitive and user-friendly experience. The application is built to cater to the needs of users who want a streamlined way to share and discover visual content.**

### Key Features:
- **Real-Time Messaging**: Implemented WebSockets using Flask-SocketIO on the backend and socket.io-client on the frontend for real-time messaging between followers and their following, allowing seamless communication without refreshing the page.
- **Efficient Deployment**: Deployed with Docker and AWS S3 for efficient data handling and environment consistency, ensuring a highly reliable and maintainable application infrastructure.
- **Dynamic UI with React and Redux**: Designed a visually appealing, responsive user interface using React and Redux, integrating modern UX/UI principles and utilizing Figma for precise wireframe designs, resulting in a seamless and engaging user experience with efficient state management.
- **Comprehensive Content Management**: Developed extensive CRUD functionalities for pins, boards, and profiles, including advanced features for user follows, search for pins/users, and board saves, ensuring robust content management capabilities that enhance user engagement and retention.
- **Search and Filter**: Integrated search and filter features, significantly improving user experience by allowing users to find and categorize content efficiently.
- **Product Magnification and Download**: Each pin can be magnified for a detailed view, and users can download images directly from the platform.
- **Simultaneous Updates (WebSockets)**: Ensured real-time updates to the pin and board counts when users interact with the content, maintaining data integrity and providing an up-to-date user experience.

# Flask React Project

This is the starter for the Flask React project.

## Getting started

1. Clone this repository (only this branch).

2. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

3. Create a __.env__ file based on the example with proper settings for your
   development environment.

4. Make sure the SQLite3 database connection URL is in the __.env__ file.

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention.**

6. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app:

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. The React frontend has no styling applied. Copy the __.css__ files from your
   Authenticate Me project into the corresponding locations in the
   __react-vite__ folder to give your project a unique look.

8. To run the React frontend in development, `cd` into the __react-vite__
   directory and run `npm i` to install dependencies. Next, run `npm run build`
   to create the `dist` folder. The starter has modified the `npm run build`
   command to include the `--watch` flag. This flag will rebuild the __dist__
   folder whenever you change your code, keeping the production version up to
   date.

## Deployment through Render.com

First, recall that Vite is a development dependency, so it will not be used in
production. This means that you must already have the __dist__ folder located in
the root of your __react-vite__ folder when you push to GitHub. This __dist__
folder contains your React code and all necessary dependencies minified and
bundled into a smaller footprint, ready to be served from your Python API.

Begin deployment by running `npm run build` in your __react-vite__ folder and
pushing any changes to GitHub.

Refer to your Render.com deployment articles for more detailed instructions
about getting started with [Render.com], creating a production database, and
deployment debugging tips.

From the Render [Dashboard], click on the "New +" button in the navigation bar,
and click on "Web Service" to create the application that will be deployed.

Select that you want to "Build and deploy from a Git repository" and click
"Next". On the next page, find the name of the application repo you want to
deploy and click the "Connect" button to the right of the name.

Now you need to fill out the form to configure your app. Most of the setup will
be handled by the __Dockerfile__, but you do need to fill in a few fields.

Start by giving your application a name.

Make sure the Region is set to the location closest to you, the Branch is set to
"main", and Runtime is set to "Docker". You can leave the Root Directory field
blank. (By default, Render will run commands from the root directory.)

Select "Free" as your Instance Type.

### Add environment variables

In the development environment, you have been securing your environment
variables in a __.env__ file, which has been removed from source control (i.e.,
the file is gitignored). In this step, you will need to input the keys and
values for the environment variables you need for production into the Render
GUI.

Add the following keys and values in the Render GUI form:

- SECRET_KEY (click "Generate" to generate a secure secret for production)
- FLASK_ENV production
- FLASK_APP app
- SCHEMA (your unique schema name, in snake_case)
-S3_BUCKET
-S3_KEY
-S3_SECRET
In a new tab, navigate to your dashboard and click on your Postgres database
instance.

Add the following keys and values:

- DATABASE_URL (copy value from the **External Database URL** field)

**Note:** Add any other keys and values that may be present in your local
__.env__ file. As you work to further develop your project, you may need to add
more environment variables to your local __.env__ file. Make sure you add these
environment variables to the Render GUI as well for the next deployment.

### Deploy

Now you are finally ready to deploy! Click "Create Web Service" to deploy your
project. The deployment process will likely take about 10-15 minutes if
everything works as expected. You can monitor the logs to see your Dockerfile
commands being executed and any errors that occur.

When deployment is complete, open your deployed site and check to see that you
have successfully deployed your Flask application to Render! You can find the
URL for your site just below the name of the Web Service at the top of the page.

**Note:** By default, Render will set Auto-Deploy for your project to true. This
setting will cause Render to re-deploy your application every time you push to
main, always keeping it up to date.

[Render.com]: https://render.com/
[Dashboard]: https://dashboard.render.com/

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
