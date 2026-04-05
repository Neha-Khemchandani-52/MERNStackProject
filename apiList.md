## authRouter :

POST /signup
POST /login
POST /logout

## profileRouter :

GET /profile/view
PATCH /profile/edit
PATCH /profile/password // Forgot password API


## connectionRequestRouter :

POST /request/send/:status/:userId // status => "not interested", "interested", "accepted", "rejected"
POST /request/review/:status/:requestId // 


## userRouter :
GET /user/requests/received // getting the requests which are in pending state
GET /user/connections // who is accepted my connections, Info regarding the Connections 
GET /user/feed - Gets you the profiles of other users on platform

## Status: ignored, interested, accepeted, rejected
