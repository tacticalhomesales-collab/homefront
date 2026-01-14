# HomeFront QA Checklist
**Manual Testing Guide for New Features**

---

## 🎯 REFER A FRIEND FLOW

### Test Path: `/refer` → `/refer-location` → `/refer-timeline` → `/refer-you` → `/refer-consent` → `/refer-confirmation`

**Page 1: /refer**
- [ ] Friend's Name field accepts text input
- [ ] Friend's Phone field accepts tel input (required)
- [ ] Friend's Email field accepts email input (optional)
- [ ] All 4 mission buttons are visible: Buy, Sell, Rent, Manage Rental
- [ ] Selecting a mission highlights the button (red background)
- [ ] Continue button is disabled when required fields are empty
- [ ] Continue button is enabled when name + phone + mission are filled
- [ ] Click Continue navigates to /refer-location with `?mission=X&mode=referral` in URL
- [ ] **PII NOT in URL**: Verify friend name/phone/email are NOT in URL params

**Page 2: /refer-location**
- [ ] City/Zip input field accepts text
- [ ] Continue button disabled when input is empty
- [ ] Continue button enabled when location is entered
- [ ] Enter key submits the form
- [ ] Click Continue navigates to /refer-timeline
- [ ] **PII NOT in URL**: Verify location is NOT in URL params (only mission/mode)

**Page 3: /refer-timeline**
- [ ] 5 timeline buttons visible: ASAP, 1-3 months, 3-6 months, 6+ months, Just exploring
- [ ] Clicking a button highlights it (red background)
- [ ] After 120ms delay, auto-navigates to /refer-you
- [ ] Other buttons are disabled after selection
- [ ] **PII NOT in URL**: Verify timeline is NOT in URL params

**Page 4: /refer-you**
- [ ] Your Name field accepts text input (required)
- [ ] Your Phone field accepts tel input
- [ ] Your Email field accepts email input
- [ ] At least one contact method (phone OR email) is required
- [ ] Continue disabled when name is empty
- [ ] Continue disabled when both phone AND email are empty
- [ ] Continue enabled when name + (phone OR email) are filled
- [ ] Click Continue navigates to /refer-consent
- [ ] **PII NOT in URL**: Verify referrer name/phone/email are NOT in URL params

**Page 5: /refer-consent**
- [ ] Two checkboxes visible: Permission to share + Terms/Privacy
- [ ] Submit button disabled when either checkbox is unchecked
- [ ] Submit button enabled when both checkboxes are checked
- [ ] Terms of Service link opens in new tab
- [ ] Privacy Policy link opens in new tab
- [ ] Click Submit button shows "Submitting..." text
- [ ] After submission, navigates to /refer-confirmation
- [ ] **Network tab**: Verify POST to `/api/referrals/submit` with all referral data in request body
- [ ] **Console log**: Verify server logs "✅ Referral received:" with full referral object

**Page 6: /refer-confirmation**
- [ ] Success message displays with green checkmark icon
- [ ] "Refer Another Friend" button navigates back to /refer
- [ ] "Back to Home" button navigates to landing page /
- [ ] sessionStorage cleared (check DevTools Application tab)

---

## 🏢 PARTNER PORTAL

### Test Path: `/partner/login` → `/partner/bulk-entry`

**Page 1: /partner/login**
- [ ] Passcode input field is type="password" (characters hidden)
- [ ] "Access Portal" button disabled when passcode is empty
- [ ] "Access Portal" button enabled when passcode is entered
- [ ] Enter key submits the form
- [ ] Entering **INCORRECT** passcode shows error: "Invalid passcode. Please try again."
- [ ] Entering **CORRECT** passcode (HOMEFRONT2026) navigates to /partner/bulk-entry
- [ ] After successful login, sessionStorage contains `partner_authenticated=true`
- [ ] "Back to Home" button navigates to landing page /

**Page 2: /partner/bulk-entry**
- [ ] **Auth Guard**: Accessing directly without login redirects to /partner/login
- [ ] Table displays 5 empty rows on initial load
- [ ] Table headers: First Name, Last Name, Phone, Mission, Location, Notes, Consent, [Remove]
- [ ] All input fields are editable
- [ ] Mission dropdown has 4 options: Buy, Sell, Rent, Manage
- [ ] Consent checkbox is clickable
- [ ] Remove button (✕) deletes the row
- [ ] **Add Row button**: Adds new empty row (max 50 rows)
- [ ] **Add Row disabled**: When 50 rows reached
- [ ] **Remove Empty Rows button**: Deletes rows with no name/phone data
- [ ] **Paste from Clipboard button**: Pastes tab-separated data from clipboard
- [ ] **Valid leads counter**: Shows count of rows with first_name + last_name + phone + consent=true
- [ ] **Submit button disabled**: When valid leads count is 0
- [ ] **Submit button enabled**: When valid leads count > 0
- [ ] **Submit button text**: Shows "Submit X Lead(s)" with correct count
- [ ] Click Submit shows "Submitting..." text
- [ ] After submission, shows "✓ Leads submitted successfully!" green message
- [ ] After submission, table resets to 5 empty rows
- [ ] **Network tab**: Verify POST to `/api/leads/bulk` with partner_id and leads array
- [ ] **Console log**: Verify server logs "✅ Bulk leads received from partner..." with batch details
- [ ] "Back to Home" button navigates to landing page /

---

## 🏠 BUY FLOW (with Compare Lenders)

### Test Path: `/choose` → `/military-status` → `/branch` → ... → `/preapproved-details` → `/compare-lenders` → `/match-preview`

**Scenario 1: User DOES want to compare lenders**
- [ ] Complete buy flow normally up to /preapproved-details
- [ ] On /preapproved-details, select "Yes" for "Do you want to compare lenders?"
- [ ] After selection, navigates to **/compare-lenders** (NOT /match-preview)
- [ ] URLSearchParams preserved (all previous data still in URL)

**Page: /compare-lenders**
- [ ] Current lender type options visible (bank/credit union/broker/online/unknown)
- [ ] Current rate band options visible (<6%, 6-6.49%, 6.5-6.99%, 7%+, Unknown)
- [ ] Priority checkboxes visible (max 2 selections): Rate, Costs, Speed, Communication
- [ ] If loan_type=VA in URL, "VA Expertise" priority is visible
- [ ] Continue button disabled until all 3 selections made
- [ ] Continue button enabled after lender type + rate band + at least 1 priority selected
- [ ] Click Continue navigates to /match-preview
- [ ] URLSearchParams include: current_lender_type, current_rate_band, compare_priority
- [ ] Review page displays "Lender Comparison" card with all compare-lenders data

**Scenario 2: User does NOT want to compare lenders**
- [ ] Complete buy flow normally up to /preapproved-details
- [ ] On /preapproved-details, select "No" for "Do you want to compare lenders?"
- [ ] After selection, navigates DIRECTLY to **/match-preview** (skips /compare-lenders)
- [ ] shop_lenders=no in URLSearchParams
- [ ] Review page does NOT show "Lender Comparison" card

---

## 🏡 SELL FLOW

### Test Path: `/mission` → `/sell-property` → `/sell-timeline` → `/sell-motivation` → `/sell-status` → `/match-preview`

**Page: /mission**
- [ ] Click "Sell" button navigates to **/sell-property** (NOT /location)

**Page: /sell-property**
- [ ] Property location input accepts city/zip
- [ ] Property type options: Single-Family, Condo, Multi-Family, Land
- [ ] Currently occupied options: Yes, No
- [ ] Continue disabled until all 3 fields filled
- [ ] Continue enabled after location + type + occupied selected
- [ ] Navigates to /sell-timeline
- [ ] URLSearchParams: mission=sell, property_location, property_type, occupied

**Page: /sell-timeline**
- [ ] 5 timeline options: ASAP, 1-3 months, 3-6 months, 6+ months, Just exploring
- [ ] Click auto-selects and navigates after 120ms
- [ ] Navigates to /sell-motivation
- [ ] URLSearchParams: sell_timeline added

**Page: /sell-motivation**
- [ ] Reason options: Relocating, Downsizing, Financial, Inherited, Divorce, Tenant Issues, Other
- [ ] Click auto-selects and navigates after 120ms
- [ ] Navigates to /sell-status
- [ ] URLSearchParams: sell_motivation added

**Page: /sell-status**
- [ ] Status options: Already Listed, Interviewing Agents, Considering Cash Offer, Not Sure
- [ ] Click auto-selects and navigates after 120ms
- [ ] Navigates to /match-preview
- [ ] URLSearchParams: sell_status added

**Page: /review**
- [ ] "Property Details" card displays with:
  - [ ] Property location
  - [ ] Property type
  - [ ] Timeline
  - [ ] Reason/Motivation
  - [ ] Status
- [ ] Edit link routes back to /sell-property

---

## 🏘️ MANAGE FLOW

### Test Path: `/mission` → `/rental-property` → `/rental-status` → `/rental-numbers` → `/rental-needs` → `/match-preview`

**Page: /mission**
- [ ] Click "Manage my Rental" button navigates to **/rental-property** (NOT /location)

**Page: /rental-property**
- [ ] Property location input accepts city/zip
- [ ] Rental type options: Single-Family, Condo, Multi-Family, Short-Term Rental
- [ ] If Multi-Family selected, units input appears
- [ ] Continue disabled until location + type filled (+ units if multi-family)
- [ ] Navigates to /rental-status
- [ ] URLSearchParams: mission=manage_rental, rental_location, rental_type, units (if applicable)

**Page: /rental-status**
- [ ] Status options: Currently Occupied, Vacant, House Hacking
- [ ] Click auto-selects and navigates after 120ms
- [ ] Navigates to /rental-numbers
- [ ] URLSearchParams: rental_status added

**Page: /rental-numbers**
- [ ] Monthly rent options: <$2K, $2K-$3K, $3K-$4K, $4K+
- [ ] Monthly mortgage options: <$2K, $2K-$3K, $3K-$4K, $4K+, No Mortgage
- [ ] HOA question: Yes/No (optional)
- [ ] Continue disabled until rent + mortgage selected
- [ ] Continue enabled after selections
- [ ] Navigates to /rental-needs
- [ ] URLSearchParams: rent_band, mortgage_band, hoa (if applicable)

**Page: /rental-needs**
- [ ] Checkboxes visible: Tenant Placement, Full Management, Maintenance, Rent Collection, Lease Enforcement, Not Sure
- [ ] Max 2 selections allowed
- [ ] Continue disabled when 0 selections
- [ ] Continue enabled when 1-2 selections
- [ ] Navigates to /match-preview
- [ ] URLSearchParams: rental_needs (comma-separated if multiple)

**Page: /review**
- [ ] "Rental Property" card displays with:
  - [ ] Property location
  - [ ] Rental type
  - [ ] Status
  - [ ] Rent band
  - [ ] Needs (comma-separated)
- [ ] Edit link routes back to /rental-property

---

## ✅ OFFICIAL GATE FLOW (Unchanged)

### Test Path: `/match-preview` → `/review` → `/consent` → `/verify` → `/contact` → `/confirmation`

**Critical: /verify is ONLY page with verification overlay**
- [ ] /match-preview: NO verification overlay
- [ ] /review: NO verification overlay
- [ ] /consent: NO verification overlay
- [ ] **/verify**: Shows 2.5s spinner + 0.5s checkmark overlay, sets verified=1, redirects to /contact
- [ ] /contact: NO verification overlay (verified=1 already set)
- [ ] /confirmation: NO verification overlay

**URLSearchParams Preservation**
- [ ] All non-PII params carried through entire flow (mission, location, branch, etc.)
- [ ] PII params (phone/email from contact page) NOT in URL after submission

---

## 🎨 VISUAL/UX CONSISTENCY

**All Pages Should:**
- [ ] Use FlowLayout component (consistent logo/header positioning)
- [ ] Logo stays in exact same position across pages (no vertical jump)
- [ ] Page transitions are smooth (180ms fade)
- [ ] Buttons use active:scale-[0.99] animation
- [ ] Primary CTA is red (#ff385c) with shadow
- [ ] Secondary buttons are white/10 with white/15 border
- [ ] Disabled buttons are white/5 with white/40 text
- [ ] Lock/double-tap prevents multiple rapid clicks (120ms delay + disabled state)
- [ ] Mobile responsive (px-4 horizontal padding, works on 375px+ viewports)

---

## 🔒 SECURITY/PRIVACY CHECKS

**PII Protection:**
- [ ] Referral flow: friend name/phone/email NOT in URL (sessionStorage only)
- [ ] Referral flow: referrer name/phone/email NOT in URL (sessionStorage only)
- [ ] Partner portal: bulk lead names/phones NOT in URL
- [ ] Contact page: phone/email submitted via POST, not GET params

**Authentication:**
- [ ] Partner portal: /partner/bulk-entry redirects to login if not authenticated
- [ ] Partner portal: sessionStorage stores partner_authenticated flag
- [ ] Partner login: Passcode is HOMEFRONT2026 (or env var NEXT_PUBLIC_PARTNER_PASSCODE)

---

## 📊 API VERIFICATION

**Referral Submission:**
- [ ] POST /api/referrals/submit returns 200 status
- [ ] Response includes: success=true, referral_id, message
- [ ] Server console logs: "✅ Referral received:" with full object
- [ ] Request body includes: friend_*, referrer_*, consented_at

**Bulk Leads Submission:**
- [ ] POST /api/leads/bulk returns 200 status
- [ ] Response includes: success=true, batch_id, leads_processed, leads_rejected
- [ ] Server console logs: "✅ Bulk leads received from partner..." with batch details
- [ ] Request body includes: partner_id, leads array, submitted_at
- [ ] Validation: Max 50 leads enforced
- [ ] Validation: Empty leads array returns 400 error
- [ ] Validation: Leads without consent are filtered out

---

## 🚀 PRODUCTION READINESS

**Before Deploying:**
- [ ] Replace API route console.logs with actual database storage
- [ ] Integrate CRM (Salesforce/HubSpot) for lead creation
- [ ] Set up email/SMS notifications for referrals and partner submissions
- [ ] Configure NEXT_PUBLIC_PARTNER_PASSCODE environment variable
- [ ] Implement proper partner authentication (magic link or OAuth)
- [ ] Add rate limiting to API routes
- [ ] Add CAPTCHA to public submission forms
- [ ] Set up monitoring/alerts for failed submissions
- [ ] Add analytics tracking for conversion funnels
- [ ] Test on real mobile devices (iOS Safari, Android Chrome)
- [ ] Run Lighthouse audit (aim for 90+ Performance, 100 Accessibility)
- [ ] Verify GDPR/CCPA compliance for PII handling

---

## 🐛 KNOWN LIMITATIONS (MVP)

1. **Partner Portal**: Simple passcode auth (not production-secure)
   - **Fix**: Implement OAuth or magic link authentication
2. **API Routes**: Data only logged to console (not persisted)
   - **Fix**: Connect to PostgreSQL/MongoDB and CRM
3. **Referral Tracking**: No follow-up workflow
   - **Fix**: Queue referrals for automated email/SMS drip campaigns
4. **Partner ID**: Hardcoded or from sessionStorage
   - **Fix**: Derive from authenticated partner account
5. **Phone Validation**: Accepts any string input
   - **Fix**: Add regex validation for US phone numbers (or use libphonenumber-js)

---

## ✨ FILE INVENTORY

**New Files Created:**
```
app/page.tsx (MODIFIED - added Refer + Partner CTAs)
app/refer/page.tsx (NEW)
app/refer-location/page.tsx (NEW)
app/refer-timeline/page.tsx (NEW)
app/refer-you/page.tsx (NEW)
app/refer-consent/page.tsx (NEW)
app/refer-confirmation/page.tsx (NEW)
app/partner/login/page.tsx (NEW)
app/partner/bulk-entry/page.tsx (NEW)
app/api/referrals/submit/route.ts (NEW)
app/api/leads/bulk/route.ts (NEW)
```

**Existing Files (Verified Working):**
```
app/military-status/page.tsx (ALREADY EXISTS)
app/sell-property/page.tsx (ALREADY EXISTS)
app/sell-timeline/page.tsx (ALREADY EXISTS)
app/sell-motivation/page.tsx (ALREADY EXISTS)
app/sell-status/page.tsx (ALREADY EXISTS)
app/rental-property/page.tsx (ALREADY EXISTS)
app/rental-status/page.tsx (ALREADY EXISTS)
app/rental-numbers/page.tsx (ALREADY EXISTS)
app/rental-needs/page.tsx (ALREADY EXISTS)
app/compare-lenders/page.tsx (ALREADY EXISTS)
app/review/page.tsx (ALREADY HAS sell/manage/compare fields)
```

**Total New Pages:** 11  
**Total New API Routes:** 2  
**Total Modified Pages:** 1 (landing page)

---

**End of QA Checklist**
