# Product Requirements Document: Free Online PDF Editor MVP

## 1. Product Name

Working name: **FreePDFFlow**

Final name can be changed later.

## 2. Product Vision

Build a simple, trustworthy online PDF editor that lets users fully edit and download up to 3 PDFs per month for free, with no watermark and no surprise paywall.

The product should feel fast, safe, honest, and easy enough for a non-technical user to complete a PDF in minutes.

## 3. Core Promise

**Edit PDFs online for free. Add text, signatures, dates, checkboxes, images, highlights, and more. Download 3 finished PDFs every month with no watermark and no surprise paywall.**

## 4. Target Users

### Primary Users

1. Small business owners
2. Freelancers and consultants
3. Parents completing school forms
4. Teachers and school staff
5. Admin assistants
6. Nonprofit workers
7. Real estate, insurance, coaching, and tax professionals
8. Busy professionals who need to quickly fix or sign a PDF

### User Mindset

The user usually arrives with an urgent task:

- I need to fill out this form.
- I need to sign this PDF.
- I need to add text to this PDF.
- I need to download the edited file without being tricked.
- I do not want to install software.

The product should prioritize speed, clarity, and trust over flashy design.

## 5. MVP Goal

Launch a working SaaS MVP where users can:

1. Visit the homepage
2. Upload a PDF
3. Edit the PDF in the browser
4. Create a free account before download
5. Download up to 3 completed PDFs per month for free
6. Upgrade to a paid plan for more downloads

## 6. Non-Goals for MVP

Do not build these in the MVP:

- Google Drive integration
- Dropbox integration
- OneDrive integration
- Gmail integration
- Chrome extension
- Team accounts
- Multi-party e-signature workflows
- Legal e-signature audit trail
- HIPAA or SOC 2 compliance claims
- Word to PDF conversion
- JPG or PNG to PDF conversion
- AI field detection
- True editing of existing PDF text
- Public share links
- Templates
- Bulk send
- Advanced admin dashboard

These can be added later.

## 7. Success Metrics

### Activation Metrics

- Visitor clicks upload button
- User uploads a PDF
- User adds at least one edit
- User creates account before download
- User exports completed PDF

### Conversion Metrics

- Free users who reach 3 monthly downloads
- Free users who view pricing page
- Free users who upgrade to Basic or Pro
- Paid user retention after 30 days

### Product Quality Metrics

- PDF upload success rate
- PDF export success rate
- Average export time
- Error rate during editing
- Number of support requests related to lost files or failed downloads

## 8. Pricing Model

### Free Plan

Price: **$0/month**

Includes:

- 3 completed PDF downloads per month
- Full basic PDF editor
- Add text
- Add signatures
- Add dates
- Add checkboxes
- Add images
- Highlight
- Draw
- Add shapes
- Rotate pages
- Delete pages
- Reorder pages
- No watermark
- 7-day file storage

Important rule:

**Only completed downloads count toward the free limit. Uploading, editing, previewing, saving, or fixing mistakes should not count.**

### Basic Plan

Suggested price:

- $12/month monthly
- $9/month annually

Includes:

- 25 completed PDF downloads per month
- Longer document storage
- Saved signatures
- Merge and organize PDFs
- Priority processing

### Pro Plan

Suggested price:

- $19/month monthly
- $15/month annually

Includes:

- Unlimited completed PDF downloads
- Longer storage
- Advanced PDF organization tools
- Password protection later
- Templates later
- AI PDF tools later

### Team Plan

Suggested price:

- $49/month starting price

Not part of MVP, but pricing card can show as coming soon if desired.

## 9. Core User Flow

### First-Time Free User

1. User lands on homepage.
2. User sees headline and upload box above the fold.
3. User uploads a PDF.
4. PDF opens in the editor.
5. User adds edits.
6. User clicks Download.
7. If not logged in, user is asked to create a free account.
8. After login, system checks monthly usage.
9. If user has downloads remaining, system exports final PDF.
10. Usage count increases by 1.
11. User downloads the final file.

### Returning Free User

1. User logs in.
2. User uploads or opens a recent PDF.
3. User edits PDF.
4. User clicks Download.
5. System checks usage.
6. If user has free downloads left, file exports.
7. If user has used all 3, upgrade prompt appears.

### Upgrade Flow

1. User reaches monthly limit or clicks Pricing.
2. User sees Free, Basic, and Pro plans.
3. User selects a paid plan.
4. Stripe Checkout opens.
5. After payment, user returns to app.
6. User plan updates in database.
7. User can continue downloading.

## 10. Homepage Requirements

### Header

Include:

- Logo
- Edit PDF
- Sign PDF
- Pricing
- FAQ
- Login
- Primary button: Edit PDF Free

### Hero Section

Headline:

**Edit PDFs Online for Free**

Subheadline:

**Add text, signatures, dates, checkboxes, images, highlights, and more. Download 3 finished PDFs every month for free. No watermark. No surprise paywall.**

Primary CTA:

**Choose PDF File**

Upload box copy:

**Drag and drop your PDF here or choose a file**

Trust copy below upload box:

**Free users get 3 completed PDF downloads per month.**

### Trust Bar

Show 4 short trust items:

- No watermark
- Secure uploads
- 3 free PDFs/month
- No install needed

### Feature Grid

Title:

**Everything You Need to Edit a PDF**

Cards:

- Add text
- Add signatures
- Add dates
- Add checkboxes
- Fill forms
- Highlight text
- Add images
- Draw or mark up
- Rotate pages
- Delete pages
- Reorder pages
- Download finished PDF

### How It Works

Title:

**Edit Your PDF in 3 Steps**

Steps:

1. Upload your PDF
2. Make your changes
3. Download your finished file

### Security Section

Title:

**Built with privacy and security in mind**

Cards:

- Secure uploads and downloads
- Private document access
- Temporary download links
- Automatic deletion for free files
- Stripe-secured payments

### Pricing Preview

Show Free, Basic, and Pro cards.

### FAQ Section

Add SEO and AEO-friendly FAQ content.

### Final CTA

Title:

**Ready to edit your PDF?**

Button:

**Upload PDF Free**

## 11. Editor Requirements

### Editor Layout

The editor should include:

- Top toolbar
- Left page thumbnail sidebar
- Center PDF viewer
- Right settings panel
- Download button
- Usage counter after login

### Top Toolbar Tools

MVP tools:

- Text
- Signature
- Date
- Checkbox
- Image
- Highlight
- Draw
- Shapes
- Undo
- Redo
- Pages
- Download

### Left Sidebar

Show page thumbnails.

Users can:

- Select a page
- Rotate page
- Delete page
- Reorder pages

### Center PDF Viewer

Users can:

- View PDF pages
- Zoom in and out
- Click to place text
- Drag added objects
- Resize added objects
- Select and delete added objects

### Right Settings Panel

When an object is selected, show relevant settings.

Text settings:

- Font size
- Bold
- Color
- Alignment
- Delete

Signature settings:

- Draw signature
- Type signature
- Upload signature image
- Clear signature

Shape settings:

- Border thickness
- Color
- Delete

Image settings:

- Replace image
- Resize
- Delete

## 12. Authentication Requirements

Use Clerk or Supabase Auth.

Required features:

- Email signup
- Email login
- Google login if simple to add
- Password reset
- Protected account area
- Login required before final download

Account creation prompt before download:

**Create a free account to download your PDF**

Supporting copy:

**Your first 3 completed PDF downloads each month are free. No watermark. No surprise paywall.**

## 13. Backend Requirements

### Recommended Stack

- Frontend: Next.js
- Hosting: Vercel
- Auth: Supabase Auth or Clerk
- Database: Supabase Postgres
- File storage: Supabase Storage or Cloudflare R2
- Payments: Stripe
- PDF viewing: PDF.js
- PDF export: pdf-lib
- Canvas layer: Konva.js or Fabric.js

### Database Tables

#### users

Fields:

- id
- email
- name
- plan
- stripe_customer_id
- created_at
- updated_at

#### documents

Fields:

- id
- user_id
- original_file_path
- edited_file_path
- file_name
- file_size
- page_count
- status
- storage_expires_at
- created_at
- updated_at

#### annotations

Fields:

- id
- document_id
- user_id
- page_number
- type
- x
- y
- width
- height
- content
- style_json
- created_at
- updated_at

#### usage_events

Fields:

- id
- user_id
- document_id
- event_type
- billing_period
- counted_against_limit
- created_at

#### subscriptions

Fields:

- id
- user_id
- stripe_customer_id
- stripe_subscription_id
- plan
- status
- current_period_start
- current_period_end
- created_at
- updated_at

#### activity_logs

Fields:

- id
- user_id
- document_id
- action
- ip_address
- user_agent
- created_at

## 14. Usage Limit Logic

### Free Plan Rule

Free users get 3 completed downloads per month.

The system should count a usage event only when:

1. The user clicks Download.
2. The PDF export is successful.
3. The completed PDF is made available for download.

The system should not count:

- Uploads
- Page views
- Draft edits
- Failed exports
- Preview actions
- Reopening a document

### Usage Counter

After login, show:

**Free downloads left: 3 of 3**

After one export:

**Free downloads left: 2 of 3**

After limit is reached:

**You have used your 3 free PDF downloads this month. Upgrade to keep downloading today.**

## 15. File Storage and Security Requirements

### MVP Security Requirements

- HTTPS everywhere
- Private file storage
- Signed temporary file URLs
- User ownership checks on every document request
- Row-level security if using Supabase
- File type validation
- File size limits
- Login required before download
- Stripe handles payments
- Free plan documents auto-delete after 7 days
- Basic activity logs
- Privacy Policy page
- Terms of Service page

### Important Security Rule

**Uploaded PDFs must not be publicly accessible. Every document must belong to a user, and every request to view, edit, download, or delete a document must verify ownership.**

### MVP Upload Limits

- Only allow PDF files at launch.
- Suggested max file size: 25MB for Free users.
- Suggested max file size: 50MB for paid users.

## 16. Payment Requirements

Use Stripe Checkout for paid subscriptions.

Required:

- Create checkout session
- Redirect user to Stripe Checkout
- Handle successful payment return
- Handle canceled payment return
- Stripe webhook updates subscription status
- User plan updates after payment
- User can manage or cancel subscription through Stripe Billing Portal

## 17. SEO and AEO Requirements

### Core Pages

- Home
- Edit PDF
- Sign PDF
- Fill PDF Form
- Pricing
- FAQ
- Privacy Policy
- Terms of Service

### SEO Page Titles

Home:

**Edit PDFs Online for Free | No Watermark PDF Editor**

Edit PDF:

**Free Online PDF Editor | Add Text, Signatures, Images, and More**

Sign PDF:

**Sign PDF Online for Free | Add Your Signature to a PDF**

Fill PDF Form:

**Fill Out PDF Forms Online for Free | No Watermark**

Pricing:

**Simple PDF Editor Pricing | 3 Free PDFs Every Month**

FAQ:

**Free Online PDF Editor FAQ | Edit, Sign, Fill, and Download PDFs**

### Meta Description Example

**Edit PDFs online for free. Add text, signatures, dates, checkboxes, images, highlights, and more. Download 3 finished PDFs every month with no watermark.**

### Structured Data

Add FAQ schema to FAQ pages.

## 18. Design Direction

Use a simple DocHub-like product flow with a modern SaaS color and button style.

Design should feel:

- Clean
- Fast
- Professional
- Trustworthy
- Simple
- Not cluttered
- Not like an ad-heavy free tool site

### Visual Priorities

1. Upload box above the fold
2. Strong CTA button
3. Clear free plan message
4. Simple trust bar
5. Clean feature cards
6. Security section
7. Pricing cards

## 19. Technical Acceptance Criteria

The MVP is ready to share when:

1. Homepage loads correctly.
2. User can upload a PDF.
3. User can view PDF pages.
4. User can add text to PDF.
5. User can add a signature.
6. User can add date, checkbox, image, highlight, and shapes.
7. User can delete or move added elements.
8. User can export the edited PDF.
9. User must create an account before final download.
10. Free user can download 3 completed PDFs per month.
11. Fourth download triggers upgrade message.
12. Stripe checkout works in test mode.
13. Successful Stripe test payment updates user plan.
14. Uploaded PDFs are private.
15. Users cannot access other users' documents.
16. Free user files can be auto-deleted after 7 days.
17. Pricing page is live.
18. FAQ page is live.
19. Privacy Policy and Terms pages are live.
20. App can be deployed to Vercel and shared with testers.

## 20. Launch Checklist

Before sharing publicly:

- Test upload with small PDFs
- Test upload with larger PDFs
- Test editor tools
- Test export quality
- Test account creation
- Test monthly usage limit
- Test Stripe test subscription
- Test file ownership protection
- Test mobile layout
- Test Chrome, Safari, Edge, and Firefox
- Add Privacy Policy
- Add Terms of Service
- Add support email
- Add basic analytics
- Add error monitoring if possible
- Invite 10 to 25 early testers

## 21. Future Roadmap

### Version 2

- Google Drive integration
- Dropbox integration
- OneDrive integration
- Templates
- Saved signatures
- Merge PDFs
- Split PDFs
- Compress PDFs
- Password protect PDFs

### Version 3

- Send PDF for signature
- Signature request tracking
- Audit trail
- Fillable form builder
- Public form links
- Email notifications

### Version 4

- AI field detection
- AI PDF summary
- AI document explanation
- AI missing field checker
- AI form builder

### Version 5

- Team workspaces
- Shared folders
- Admin controls
- Branding
- API access
- Zapier or Make integration

