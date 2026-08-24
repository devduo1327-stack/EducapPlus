# Security Specification: Grade 11 & 12 Study Companion

## 1. Data Invariants
- **User Settings**: A user document must match the authenticating user (`userId == request.auth.uid`). Users can only update their own records.
- **Quiz Score Record**: A quiz history record must belong to the user (`userId == request.auth.uid`), and its timestamps must match the server runtime time.
- **IDs**: All document IDs must be clean alpha-numeric strings and less than or equal to 128 characters to guard against injection.

## 2. The "Dirty Dozen" Malicious Payloads
1. **Identity Spoofing on User Settings**: An attacker (UID: `attacker_abc`) tries to create a settings document in `users/victim_123`.
2. **Ghost field in Settings**: An attacker tries to write `{ name: 'John Doe', adminPrivilege: true }` into settings to attempt elevation.
3. **Invalid ID Format on Settings**: Writing to user path `users/user_with_very_long_string_junk_character_value_!!!!!!!!`.
4. **Incorrect Timestamp on Quiz History**: Submitting a pre-dated quiz history score (`completedAt` in 2020 instead of `request.time`).
5. **No Auth writing**: A non-authenticated client attempts to create settings in `/users/some_uid`.
6. **Malicious Score Modification**: A user tries to update their quiz score under `/users/my_id/quizHistory/some_quiz` from `3` to `100` after creation (terminal locking).
7. **Type Mismatch in Settings (Board)**: Setting board as an array `["CBSE", "ICSE"]` instead of a string.
8. **Negative Quiz Score**: Submitting a quiz with score `-1` or totalQuestions `0`.
9. **Tampering with Identity UID inside settings**: Payload contains a mismatched `userId` field than path UID.
10. **Array Poisoning**: Submitting an empty collection or array of 1000 items on a constrained metadata field.
11. **Blanket Querying**: Unauthenticated user attempting to list all quiz histories across all users.
12. **System Config Tampering**: Altering system metadata fields if introduced.

## 3. Security Assertions
Our firestore security rules ensure all above payloads return standard `PERMISSION_DENIED` errors at the Firestore engine level.
