# Student Dashboard

A Next.js (App Router) app where students log in and see their profile, courses, progress and teacher remarks. Data is stored in MongoDB Atlas.

## Project structure

```
src/
├─ app/
│  ├─ api/
│  │  ├─ login/route.jsx       # POST: check credentials
│  │  ├─ user-data/route.jsx   # GET: fetch one student by id
│  │  ├─ users/route.js
│  │  └─ seed/route.jsx        # insert starter data
│  ├─ login/page.jsx
│  └─ dashboard/page.jsx       # fetches data, passes it to the UI
├─ components/ui/
│  ├─ login-from.jsx           # login form (handleLogin)
│  └─ dashborad.jsx            # dashboard UI (receives `studentdata`)
└─ utils/mongodb.jsx           # connectToMongoDB()
```

## Environment

Create `.env.local` in the project root (never commit it):

```
MONGODB_URI=mongodb+srv://<dbUser>:<password>@<cluster>.mongodb.net/centerdb
```

- Use the **database user** from Atlas → Security → Database Access, not your Atlas account login.
- URL-encode special characters in the password (`@` → `%40`, `#` → `%23`, `:` → `%3A`).
- Restart the dev server after changing env files.

Database: `centerdb`, collection: `user`.

## Login flow

```
Login form → POST /api/login → MongoDB (centerdb.user)
     ↓
localStorage (userId) → redirect to /dashboard
     ↓
dashboard/page.jsx → GET /api/user-data?userId=... → MongoDB
     ↓
<Dashborad studentdata={...} />
```

1. **Form submit** (`login-from.jsx`): `handleLogin` sends `POST /api/login` with `{ name, password }`.
2. **Login API** (`api/login/route.jsx`): trims the username and runs `findOne({ username })`.
   - User not found → `404 { error: "User not found" }`
   - Wrong password → `401 { error: "Wrong password" }`
   - Success → `200 { user: { id, name } }`
3. **Save session**: the form stores `userId` and `userName` in `localStorage`, then `router.push('/dashboard')`.
4. **Dashboard page** (`dashboard/page.jsx`, client component): reads `userId` from `localStorage` (redirects to `/login` if missing) and calls `/api/user-data?userId=<id>`.
5. **User-data API** (`api/user-data/route.jsx`): validates the id, runs `findOne({ _id: ObjectId(userId) }, { projection: { password: 0 } })` and returns `{ data: {...} }`.
6. **Dashboard UI** (`dashborad.jsx`): `useMemo` maps the fields for display. Log Out clears `localStorage` and returns to `/login`.

### Data shapes

| Stage | Shape |
|---|---|
| Form → login API | `{ name, password }` |
| Login API → form | `{ user: { id, name } }` |
| user-data API → page | `{ data: { _id, username, fatherName, activeCourses, courseProgress, teacherRemarks } }` |
| page → component | `studentdata = json.data` (no wrapper) |

## User document format

```json
{
  "username": "Ali",
  "password": "456",
  "fatherName": "Ahmed Khan",
  "activeCourses": ["CIT", "English"],
  "courseProgress": ["beginning", "complete"],
  "teacherRemarks": "Good effort"
}
```

Do not add `_id`; MongoDB creates it.

## Managing users manually

### Atlas website (easiest)
1. Atlas → **Database → Browse Collections**.
2. Open **CenterCluster → centerdb → user**.
3. Click **Insert Document**, switch to the `{ }` JSON view, paste the document, click **Insert**.

To edit or delete, hover over a document and use the pencil or trash icon.

### mongosh

```bash
npx mongosh "mongodb+srv://<cluster>.mongodb.net/centerdb" --username <dbUser>
```

```js
// add one user
db.user.insertOne({
  username: "Ali",
  password: "456",
  fatherName: "Ahmed Khan",
  activeCourses: ["CIT", "English"],
  courseProgress: ["beginning", "complete"],
  teacherRemarks: "Good effort"
})

// add several
db.user.insertMany([ { /* ... */ }, { /* ... */ } ])

// change remarks
db.user.updateOne({ username: "Ali" }, { $set: { teacherRemarks: "Excellent" } })

// add a course (keep both arrays aligned)
db.user.updateOne(
  { username: "Ali" },
  { $push: { activeCourses: "Math", courseProgress: "beginning" } }
)

// delete
db.user.deleteOne({ username: "Ali" })

// enforce unique usernames (run once)
db.user.createIndex({ username: 1 }, { unique: true })
```

### Rules to remember
- `activeCourses` and `courseProgress` match by **position**; keep them the same length.
- Progress values must be exactly `beginning`, `middle` or `complete` (lowercase). Anything else displays as "beginning".
- Usernames are **case-sensitive** (`Ali` ≠ `ali`) and should be unique.

## Troubleshooting

| Error | Cause / fix |
|---|---|
| `SSL alert 80` / `tlsv1 alert internal error` | Your IP is not in Atlas → Network Access. Add it (or check VPN/ISP, paused cluster). |
| `bad auth : authentication failed` | Wrong DB username/password, unencoded special characters, or `<password>` brackets left in the URI. |
| `404` on login | Username not found (check case and spaces). |
| `Cannot read properties of undefined (reading 'id')` | Frontend expects `data.user.id`; the API must return `{ user: { id, name } }`. |
| Redirect to `/dashboard` gives 404 | Folder is named `dashborad`. Rename it to `dashboard` or change the redirect. |
| Dashboard shows no courses or only the id | Field names don't match (`activeCourses` vs `activeCourse`), or the old API route is still being served. |
| `Invalid hook call` / `studentdata is not defined` | `useMemo`/`useState` must be inside the component function. |

## Before going live

- Hash passwords with `bcrypt` and compare using `bcrypt.compare` (passwords are plain text now).
- Replace `localStorage` + `userId` in the URL with a signed session cookie or JWT; right now anyone can request another user's id.
- Rename `dashborad` to `dashboard` everywhere (folder and component file).
- Keep the connection string in `.env.local` and out of version control.
- Restrict the Atlas IP access list instead of using `0.0.0.0/0`.