# node-voting-app
description -voting app with user signup, login, profile page, password change  and same for candidate - like sign up, profile, edit page etc and with vote casting , vote count by candidate. 


Voting Appilation

A functionality where user can vote for for given set of candidate. 



Model?
Routes?

 voting App functionality
 1. user sign in / sign up
 2. see the list of candidate 
 3. vote one of the candidate, after voting, user cant vote again.
 4. there is a route which show s the list of candidate and there live vote counts sorted by their counts. 
 5. user must contain their unique government id proof named : aadhar card
 6. there should be an admin who can maintain the table content of candidate and he can`t vote at all. 
 7. user can change their password. 
 8. user can login with addhar number only. 


 Routes (end point)

 User Authentication    
      /sign-up: POST- create a user new account.
      /login: POST - Log in to an existing account.(addhar card number + password)

 Voting:
     /candidate: GET - geta list of all candidate
     /vote/candidateID: POST- vote for a specific candidate

Vote Counts:
     vote/counts: GET- Get the lists of candidate sorted by their vote counts. 

User Profiles:
     /profile: GET - get the user`s profile inforamtion.     
     /profile/password: PUT - change the user passwords. 

Admin candidate management:
      /candidates: POST - create a new candidate.
      /candidate/candidateID: PUT - update a existing candidate.
      /candidate/candidateID:  DELETE - delete a candidate.
     









