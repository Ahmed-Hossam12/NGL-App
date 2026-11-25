# NGL APP [anonymous-messaging-app]
* send anonymous messages or public messages 
* view profile with related messages 
* handle manage messages

- tech stack :
            - express
            - javascript
            - mongodb/mongoose
            - redis [cashing] 
            - nodemailer [email]
            - jwt [authentication]
            - bcrypt [password hashing]
            - oauth2 [google]
            - validation [zod , joi ,Yup , class-validator] 
            - Error handling [AppError] 
            - rate limiting [nginx] 

- features:
   - authentication flow:
      - Register 
      - verify email using OTP
      - login
      - reset password.
      - send OTP.
      - login with google.
      - logout.

   - messages flow:
     - send messages. [anonymous - public]
     - view messages.
     - delete messages. [soft-delete/archive]
     
   - user flow [me]:
     - view profile.[me]
     - edit profile. [me]
     - delete profile. [me] 

  - guard:
     - authentication [token]
===================================
* todo: session 2
- refactor send email
- verify an account switch isVerified to true
- login and pass token using cookies 
- resend OTP. [in-case otp expired , in-case reset password]
- reset password
===================================
* todo: session 3 
- customize app error . 
- intro to Dependency inversion principle. [class] SOLID >> functions.
- reset password.

===================================
* todo: session 4
- social login using Google  
    - get idToken from FE.
    - verify idToken. ask Google
    - get payload from idToken. {id , name , pp , email , dob , phone}
    - if user exist >> generate token
    - if user not exist >> create user >> generate token 
======================================
* todo: session 6
1. refactor code structure.
    - lib: common functions which are related to our App. [ngl]
    - pkg: common packages which related to any App. [base-code]
2. caching. 
    - mandatory features 
    - reduce latency 
    - avoid frequently DB queries.
    - hash-map [key - value]
3. custom config.
4. withCache middleware. [intercept]
5. idempotency.
6. correlationId. 
7. mailJet
===================================
* todo: session 8 
-----------------
1. How to upload files.
2. How to validate files.
3. busboy VS multer.
4. magic number validations.
5. upload profile picture API 
 
* todo: session 9
----------------
1. concept of cluster
2. deploy DB on real server 
3. load balancer
4. apply rate-limiting [network-application]