# Upwork Sign-up Automation Worker

A simple tool to automate Upwork Worker account registration.

## Quick Setup

1. Install dependencies:
```bash
npm install
```

2. Set up account.json:
```json{
    "id": 1,
    "first_name": "first_name",
    "last_name": "last_name",
    "email": "email",
    "password": "password",
    "country": "country",
    "inboxId": "mailslurp_inboxID",
    "category": "category_find_in_notes.txt",
    "special_skill": "special_skill_find_in_notes.txt",
    "company": "company",
    "university": "university",
    "bio": "biography at least 100 char",
    "hourly": "hourly_number",
    "address": "address",
    "city": "city",
    "birthday": "brithday_with_format_2002-01-01",
    "number": "phone_number"
}
```

3. Set up .env:
```env
MAILSLURP_API=register_mailslurp
USERNAME_PROXY=optional
PASSWORD_PROXY=optional
```

4. Run the tool:
```bash
npm run start:dev
```
