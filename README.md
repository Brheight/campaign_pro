# CampaignPro (Email Marketing UI)

CampaignPro is a lightweight, user-friendly marketing email platform built with React (vanilla components, `lucide-react` icons, inline styles) and backend APIs (Django REST / DRF). 

The frontend is designed around two guiding principles:
- "No engineering degree required" — workflows are simple, form-based, and explicit.
- "Complexity is a bug" — minimal external UI dependencies; the app is clear and action-driven.

## 📁 Location

- UI source: `campaign_pro/ui/src/pages`
- Core pages:
  - `SubscribersPage.jsx`
  - `TemplatesPage.jsx`
  - `TemplateNew.jsx`
  - `CampaignsPage.jsx`

## 🧭 Workflow (user tutorial path)

1. Manage subscribers:
   - Add a contact (e.g., `John Doe`), assign to mailing list or create new list (`new_mailing_list`)
   - Bulk CSV uploads & list filtering
2. Create template:
   - Use Templates section, new template workflow (name, subject, body)
   - Support for plain text and HTML
   - Insert variables: `{{name}}`, `{{email}}`, `{{unsubscribe_url}}`, `{{company_name}}`, `{{current_year}}`
3. Setup campaign:
   - New campaign with list + template + schedule + batch size
   - Prepare & send controls, pause/resume, duplicate, status
4. Dashboard/config:
   - Campaign stats and profiles
   - Email provider config (Amazon SES, Brevo)

## 🔧 APIs used

- `/subscribers/`
- `/mailing-lists/`
- `/templates/`
- `/campaigns/`
- `/email-configurations/`
- `/sending-profile/me/`

## 🚀 Running locally

1. Install Python deps (backend repository):

```powershell
cd c:\Users\campaign_pro
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

2. Install UI deps and run React app:

```powershell
cd c:\Users\campaign_pro\ui
npm install
npm start
# or yarn install && yarn start
```

3. Set environment variable in development:

- `REACT_APP_API_URL` or the file uses `process.env.NODE_ENV` fallback to `http://localhost:8000/api/v1`.

## 🛡️ Authentication

- JWT token in `localStorage.access`
- CSRF token from `document.cookie` set globally in axios header `X-CSRFToken`
- Redirect to `/` when no token detected

## 💎 UI notes

- Style: inline JS style objects, animated hovers,
- Components: reusable cards (`CampaignCard`, `TemplateCard`, `StatCard`)
- User feedback: success + error banners with icons

## 🧩 Next improvements

- Extract shared UI components into a common folder
- Centralize API client (axios) and auth/CSRF handling
- Add tests for form validation and API error states

---


