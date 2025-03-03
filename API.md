# RAFFLE REST API Functions
The base endpoint is `http(s)://DOMAIN/api/v1/`

## Datatypes:
- **IdValue**
    - `id: int` The unique identifier of the object
- **Password**
    - `id: int` The unique identifier of the password
    - `value: string` The actual password value used to authorize
    - `role: string` Will always be "User"
- **PasswordDetails**
    - `accessPassword: Password` The password
    - `isUsed: boolean` Wether this password has been used to create a user
- **User**
    - `id: int` The unique identifier of the user
    - `name: string` The name the user entered when registering
    - `email: string` The e-mail entered by the user when registering
    - `mobile: string` The phone number entered by the user when registering
    - `tickets: int` The amount of tickets the user has
    - `passwordUsed: Password` The password used to register this user
- **UpdateTicketCountRequest**
    - `id: int` The id of the user whose ticket count is to be updated
    - `tickets: int` The new amount of tickets that the user should have
- **Raffle**
    - `id: int` The unique identifier of the raffle
    - `winnerName: string` The name of the raffle winner
    - `winnerTickets: string` The amount of tickets that the winner had
    - `date: DateOnly` The date at which the raffle was started
- **WelcomePage**
    - `title: string | null` The title to be displayed on the welcome page
    - `description: string | null` A short description that will be displayed under the title
    - `image: string | null` A Base64 encoded image that will be used as the background image 
- **CreateUserRequest**
    - `name: string` The name of the user 
    - `email: string` The e-mail address of the user
    - `mobile: string` The phone number of the user
- **UserRoleResult**
    - `role: string` The role of the password used (Either `User` or `Admin`)
- **BooleanResult**
    - `value: boolean` Either true or false

## Admin
Features that allow administrating the page  
Authorization: In the HTTP Header `Authorization: Bearer <AdminPassword>`  
- **/Admin/CreatePassword**
    - Creates a new user password and returns it
    - Method: `POST`
    - Response: json `Password`
- **/Admin/GetPasswords**
    - Lists all passwords that are currently available
    - Method: `GET`
    - Response: json `PasswordDetails[]`
- **/Admin/DeletePassword**
    - Delets the password with the given id
    - Method: `DELETE`
    - Request: json `IdValue`
    - Response: `204 No Content`
- **/Admin/GetUsers**
    - Lists all Users that are currently registered
    - Method: `GET`
    - Response: json `User[]`
- **/Admin/DeleteUser**
    - Deletes the User with the given id
    - Method: `DELETE`
    - Request: json `IdValue`
    - Response: `204 No Content`
- **/Admin/UpdateTicketCount**
    - Updates the amount of tickets that the user with the given id has
    - Method: `PATCH`
    - Request: json `UpdateTicketCountRequest`
    - Response: `204 No Content`
- **/Admin/StartRaffle**
    - Creates a new raffle and picks a winner based on tickets collected
    - Method: `POST`
    - Response: json `Raffle`
- **/Admin/GetRaffles**
    - Returns a list of all raffles that have been started
    - Method: `GET`
    - Response: json `Raffle[]`
- **/Admin/DeleteRaffle**
    - Deletes the raffle with the given id
    - Method: `DELETE`
    - Request: json `IdValue`
    - Response: `204 No Content`
- **/Admin/UpdateWelcomePage**
    - Updates the welcome page that will be shown to the user
    - Method: `PATCH`
    - Request: json `WelcomePage`
    - Response: json `WelcomePage`

## User
Features that the users of the page are allowed to use  
Authorization: In the HTTP Header `Authorization: Bearer <UserPassword>`  
- **/Users/PasswordUsed**
    - Returns true if the password has been used to create a user
    - Method: `GET`
    - Response: json `BooleanResult`
- **/Users/CheckRole**
    - Returns the role of the password used to authenticate
    - Method: `GET`
    - Response: json `UserRoleResult`
- **/Users/CreateUser**
    - Creates a new user with the given information
    - Method: `POST`
    - Request: json `CreateUserRequest`
    - Response: `201 Created`
- **/Users/GetWelcomePage**
    - Returns the welcome page as defined by the admin
    - Method: `GET`
    - Response: json `WelcomePage`