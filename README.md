# team46
This webapp was created for CSC309 Winter 2022.

It was created with 3 other teammates, junaidquraishi, waynezhu6, and hamidahmed.

## Libraries used

### Back end

```
  "bcrypt": "^5.0.1",
  "bcryptjs": "^2.4.3",
  "body-parser": "^1.19.1",
  "cors": "^2.8.5",
  "dotenv": "^10.0.0",
  "express": "^4.17.1",
  "jsonwebtoken": "^8.5.1",
  "jwt-then": "^1.0.1",
  "mongoose": "^5.13.5",
  "nodemailer": "^6.6.3",
  "socket.io": "^4.1.3",
  "socketio-jwt": "^4.6.2"
```

### Front end

```
  "@emotion/react": "^11.8.1",
  "@emotion/styled": "^11.8.1",
  "@mui/icons-material": "^5.4.4",
  "@reduxjs/toolkit": "^1.8.0",
  "@testing-library/jest-dom": "^5.16.2",
  "@testing-library/react": "^12.1.3",
  "@testing-library/user-event": "^13.5.0",
  "axios": "^0.26.1",
  "bootstrap": "^5.1.3",
  "http-proxy-middleware": "^2.0.4",
  "react": "^17.0.2",
  "react-bootstrap": "^2.1.2",
  "react-dom": "^17.0.2",
  "react-icons": "^4.3.1",
  "react-redux": "^7.2.6",
  "react-router-dom": "^6.2.1",
  "react-scripts": "5.0.0",
  "web-vitals": "^2.1.4"
```

## Available Scripts

In the project directory, you can run:

### `npm install`

to install all dependencies

### `npm start`

This will launch the website

## Mock Accounts and other things for testing

#### To login to the application as a User use the following credentials:

username: Minfan

password: 123456

#### To login to the application as an Admin use the following credentials:

username: admin

password: admin123

#### The public room with tag `blacklisted` should be blacklisted and un joinable.

#### Any public room should have two mock invites which can be accepted or declined.

-   This should simmulate user accepting or declining an invite.

#### The public room with tag `cs` should have two test users who you can invite to chat:

-   the users should be `test` and `testj2al`.
-   When invited to private room there is a button to simmulate the invited user joining.

## Instructions

-   Open another window in incognito to test with other users

### User

-   Login with given credentials or signup.
-   Open settings top right to add bio, age, email, phone number and change name or password.
-   Join tag `cs` as any alias.
-   Now you should be able to type in chat which is being saved.
-   Two mock testing accounts should already be in the room and you should have two mock invites.
-   From following the previous mock testing instruction you should be able to simmulate accepting and inviting other users.

### Admin

-   Login with given admin credentials

### Ban User

-   Select Blacklist and enter 624cf9583096d48a748c7810
-   This makes the user unable to join chats
-   Try to login using the following credentials for the above user: username:test12, password:123456
-   Should not be able to login

### Delete User

-   Select delete user and enter 624728b943f5b0857710b60e
-   This should delete the user and he should not be able to sign in
-   Try to login using the following credentials for the above user: username:test12, password:123456
-   Should not be able to login

### Blacklist tag

-   Select blacklist tag and enter blacklisted
-   This should blacklist the tag
-   You should not be able to enter chat

### Clear Chatroom

-   Select clear chatroom and enter js
-   Should delete all the messages inside chatroom
-   Try viewing the messages by entering the js chat since the chatroom will be empty

### View Reported Users

-   Should Show the reported users, the type of report , and reported messages
-   Press clear button the render the next report

## url: http://3.99.149.108/landing

## User Functionalities

-   Create an account by signing up (Enter username and password).

-   Login by entering correct credentials to existing account. In our case username: Minfan, and password: TA.

-   Click on settings to change the name, age, email, phone number, bio, or change the password.

-   Find a chatroom by entering an alias (name) and an interest(tag). The app will group you with people with interests similar to your's.

-   Join a chatroom and enter messages (using input textbox) to communicate in real time with other users.

-   Navigate to the left side panel of the chatroom to click on participants. Once a participant is clicked (denoted by their name(alias)), a popup display is opened allowing
    users to report the user or invite him to a private chatroom.

-   Chat with individual users in a private chatroom

-   Logout of account by clicking logout

## Admin functionalities

-   Login as an Admin given preset username and password (username:admin, password:admin).

-   Delete a user, blacklist a tag, Ban a user, or clear a chatroom.

-   If you wish to delete a user, provide the userid in the input field and click button DELETE. Deleting a user removes the user from the database.

-   If you wish to blacklist a tag, provide the tag in the input field and click button DELETE. Blacklisting a tag deletes the chat with the associated tag.

-   If you wish to ban a user, provide the userid in the input field and click button DELETE. Banning a user prevents him from joining a chat.

-   If you wish to clear a chatroom, provide the tag in the input field and click button DELETE. Clearing a chatroom removes all messages inside the chatroom.

## Overview of the routes

-   Protected routes need authentication header with "Bearer " then the token from login.

### admin `localhost:5000/api/admin`

### `/deleteuser`

-   Protected put request.
-   Gets the user then sets user isDeleted to true.
-   Required: String of the user id.
-   Output: nothing.

### `/blacklist_tag`

-   Protected put request.
-   Gets the tag then sets blacklisted to true
-   Required: String `tag`
-   Output: nothing

### `/banuser`

-   Protected put request.
-   Gets the user then sets isBanned to true
-   Required: Strings `UserId`
-   Output: nothing

### `/clearchat`

-   Protected put request.
-   Gets the chat given the tag and deletes all the messages in the room
-   Required: String `tag`
-   Output:nothing

### `/clearreport`

-   Protected post request.
-   Required: Strings `reportId` and `reportedUserId`
-   Output: success, report document, reportedUser document.

### `/getreport`

-   Protected get request.
-   Gets the first report document.
-   Required: nothing.
-   Output: success, report document.

### auth `localhost:5000/api/auth`

### `/register`

-   Post request.
-   Creates a new user document
-   Required: Strings `username`, `password` and `name`.
-   Output: success, user document, authentication token.

### `/login`

-   Post request.
-   Gets the user then sets required info into Redux and saves the authentication token in local storage.
-   Required: Strings `username` and `password`.
-   Output: success, user document, authentication token.

### `/loaduser`

-   Protected get request.
-   Gets the user then sets required info into Redux and saves the authentication token in local storage.
-   Required: nothing.
-   Output: success, user document, authentication token.

### `/logout`

-   Protected put request.
-   Gets the user then sets status to 0 (offline).
-   Required: nothing required.
-   Output: success, user document.

### `/deleteuser`

-   Protected put request.
-   Gets the user then sets user isDeleted to true.
-   Required: nothing required.
-   Output: success, user document.

### user `localhost:5000/api/user`

### `/getprofile/:username`

-   Protected get request.
-   Gets relevant information from user profile (exlcuding password and status)
-   Required: String `username`
-   Output: name, age, email, bio, phone number of the user and success status of call

### `/setprofile`

-   Protected post request.
-   Updates the user fields provided by caller on a specified user document
-   Required: Strings `username`, `name`, `bio`, `email`, `phoneNumber`
-   Optional: String `password`
-   Output: success

### `/reportuser`

-   Protected post request.
-   Creates a report ticket containing the reported user id, alias, and past 10 messages.
-   Required: Strings `reportedUserId`, `reportType` ("NAME" or "TEXT") and `reportedAlias`.
-   Output: success, report document, reportedUser document.

### room `localhost:5000/api/room`

### `/joinroom`

-   Protected post request.
-   Gets the room if it exists otherwise creates a room with the tag and adds the user to rooms pariticipants with provided alias and name.
-   Required: Strings `tag` and `alias`.
-   Output: success, room document, participants excluding self, your alias and your truncated user id.

### `/joinprivateroom`

-   Protected post request.
-   Gets the private room if it exists otherwise creates a room with the a combo of the user id's and tag then adds the user to rooms pariticipants with provided alias and name.
-   Required: Strings `tag`, `alias` and the other users id `otherUserId`.
-   Output: success, room document, participants excluding self, your name and your truncated user id.

### `/leaveroom`

-   Protected post request.
-   Gets the room then removes the user from the rooms participants list.
-   Required: String `tag`.
-   Output: success, room document.

### `/leaveprivateroom`

-   Protected post request.
-   Gets the room then removes the user from the rooms participants list.
-   Required: String `tag` and the other users id `otherUserId`.
-   Output: success, room document.

### `/gettag`

-   Protected get request.
-   Gets the room document specified by the caller
-   Required: string `tag`
-   Output: Room document if found

### `/getmessages`

-   Protected get request.
-   Gets all message documents which are associated with the room tag and userid specified by caller
-   Required: strings `userid`, `offset`, `tag`
-   Output: list of message objects and success

### `/addmessage`

-   Protected post request.
-   Creates a message document
-   Required: strings `tag`, `from`, `text`
-   Output: message object created, message document id, success

### `/removemessage`

-   Protected post request.
-   Updates the isDeleted field of a message document to true
-   Required: string `_id` of message document
-   Output: None
