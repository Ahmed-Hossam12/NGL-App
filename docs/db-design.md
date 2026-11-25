# **DATABASE DESIGN** 

## * User

  - name -> [ String - required - minLength: 3 - maxLength: 20 - trim: true ]
  - email -> [String - required - unique - trim: true - lowercase: true ]
  - password [String - in-case provider local >> required]
  - provider [Google - Facebook - Local]
  - isDeleted [boolean] - [default: false]
  - isVerified [boolean] - [default: false]
  - dob [Date]
  - gender [String] - [Male - Female]
  - createdAt [Date]
  - updatedAt [Date]
---------------------------

## * Message

  - content -> [String - required - trim: true - minlength: 1 - maxlength: 200]
  - receiver -> [ObjectId - required - ref: User]
  - sender  -> [ObjectId - ref: User].
  - createdAt -> [Date]
  - updatedAt  -> [Date]
  - isDeleted -> [boolean] - [default: false]
---------------------------

## * OTP: [one-time - password] TODO: switch to caching.

   - delete OTP after 10 minutes
   - delete OTP after usage 
   - store OTP temporarily
      - database using mongodb support TTL [time to live] - [HDD]
      - into cache redis support TTL  [ram] x50 faster more DB
- code ->  [String - required - length]
- email -> [String - required - unique - trim: true - lowercase: true ]
- expiresAt -> [Date] 2026-9-14T08:15:00:000Z
- createdAt ->  [Date] 2026-9-14T08:10:00.000Z
- attempts