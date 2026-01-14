# HomeFront PWA + Partner Portal + Refer-a-Friend QA Checklist

## PWA Installation & Branding

### Android/Chrome
- [ ] Long-press app icon on home screen shows "Share my QR" and "Partner Portal" shortcuts
- [ ] Tap "Share my QR" shortcut opens `/?share=1` with share modal auto-opened
- [ ] Tap "Partner Portal" shortcut opens `/partner` and routes correctly
- [ ] App icon displays correctly on home screen (not default browser icon)
- [ ] App name shows as "HomeFront" (not "Ambassador")
- [ ] Theme color is `#0A1C3C` (dark blue header)
- [ ] Standalone mode works (no browser chrome)

### iOS/Safari
- [ ] Add to Home Screen shows correct icon (homefront_icon-180.png)
- [ ] App opens in standalone mode (no Safari UI)
- [ ] App name shows as "HomeFront"
- [ ] Status bar is black-translucent
- [ ] Icons display correctly (apple-touch-icon)

### Launch Overlay
- [ ] First launch shows HomeFront logo with spinner (600-900ms)
- [ ] Subsequent loads skip overlay (sessionStorage check works)
- [ ] Respects `prefers-reduced-motion` (shorter duration if enabled)
- [ ] No flickering or layout shift

## Landing Page (/)

### Basic Functionality
- [ ] Logo displays correctly (homefront-logo.png)
- [ ] "Get Started" button routes to `/choose`
- [ ] "Share" button opens ShareSheetModal
- [ ] "Refer a Friend" button routes to `/refer`
- [ ] "Partner Portal" button routes to `/partner`

### Auto-Open Share
- [ ] Visiting `/?share=1` auto-opens ShareSheetModal on mount
- [ ] Query param is read correctly from URL
- [ ] Modal opens automatically without user interaction

## ShareSheetModal Component

### Code Generation Priority
- [ ] If `hf_partner_public_code` exists → uses partner code
- [ ] Else if `hf_user_code` exists → uses user code
- [ ] Else → generates new 6-char code and stores in `hf_user_code`
- [ ] Code persists across sessions (localStorage)

### QR Code Display
- [ ] QR code renders correctly (512x512px)
- [ ] QR code is scannable (test with phone camera)
- [ ] QR encodes correct URL: `{origin}/?ref={code}`
- [ ] Colors are correct (dark: #0A1C3C, light: #FFFFFF)

### Action Buttons
- [ ] "Copy Code" copies code to clipboard
- [ ] "Copy Link" copies full referral link to clipboard
- [ ] "Share" triggers Web Share API (if supported)
- [ ] "Share" falls back to copy link (if Web Share unavailable)
- [ ] "Copy Message" copies prefilled message with code + link
- [ ] All copy actions show "✓ Copied!" feedback for 2 seconds

### Modal Behavior
- [ ] Modal opens/closes smoothly
- [ ] Backdrop click closes modal
- [ ] X button closes modal
- [ ] Modal is scrollable on small screens
- [ ] No z-index conflicts with other modals

## Partner Portal

### /partner (Smart Entry)
- [ ] If `hf_partner` exists → redirects to `/partner/dashboard`
- [ ] If `hf_partner` does NOT exist → redirects to `/partner/signup`
- [ ] Shows loading spinner during redirect (no flash of content)

### /partner/signup
- [ ] First name field works (required)
- [ ] Last name field works (required)
- [ ] Phone field works (optional if email provided)
- [ ] Email field works (optional if phone provided)
- [ ] "OR" separator displays correctly
- [ ] Submit disabled if first name OR last name OR (phone AND email) empty
- [ ] Submit button shows "Creating..." during processing
- [ ] Generates 8-char partner code (uppercase letters + digits)
- [ ] Stores `hf_partner` object in localStorage
- [ ] Stores `hf_partner_public_code` in localStorage
- [ ] Redirects to `/partner/dashboard` after signup
- [ ] "Back to Home" button works

### /partner/dashboard
- [ ] Displays partner first name in subtitle
- [ ] Shows QR code for partner referral link
- [ ] QR encodes: `{origin}/?ref={partner_public_code}`
- [ ] Displays partner code in large text
- [ ] "Copy Link" button works
- [ ] "Share" button works (Web Share API or fallback)
- [ ] "Copy Code" button works
- [ ] Empty state shows: "Referral tracking will appear here once syncing is enabled."
- [ ] "Back to Home" button works
- [ ] "Reset Partner Account" confirms before deleting
- [ ] Reset clears `hf_partner` and `hf_partner_public_code`
- [ ] Reset redirects to `/partner/signup`
- [ ] If `hf_partner` missing → redirects to `/partner/signup`

## Refer-a-Friend Flow

### Storage Safety (NO PII in URL)
- [ ] Friend name stored in sessionStorage (NOT URL params)
- [ ] Friend phone stored in sessionStorage (NOT URL params)
- [ ] Friend email stored in sessionStorage (NOT URL params)
- [ ] Referrer name stored in sessionStorage (NOT URL params)
- [ ] Referrer contact stored in sessionStorage (NOT URL params)
- [ ] ONLY `mission` and `mode=referral` in URL params (non-PII)

### /refer
- [ ] Friend name field works
- [ ] Friend phone field works (required)
- [ ] Friend email field works (optional)
- [ ] Mission buttons work (Buy/Sell/Rent/Manage Rental)
- [ ] Continue disabled if name/phone/mission missing
- [ ] Data stored in sessionStorage as `referral_friend`
- [ ] Routes to `/refer-location?mission=X&mode=referral`

### /refer-location
- [ ] Location input works
- [ ] Continue button enabled when location entered
- [ ] Data stored in sessionStorage as `referral_location`
- [ ] Routes to `/refer-timeline`

### /refer-timeline
- [ ] Timeline buttons work (ASAP/1-3mo/3-6mo/6+mo/Exploring)
- [ ] Data stored in sessionStorage as `referral_timeline`
- [ ] Routes to `/refer-you`

### /refer-you
- [ ] Referrer name field works
- [ ] Referrer phone field works (at least one required)
- [ ] Referrer email field works (at least one required)
- [ ] Continue disabled if name AND (phone/email) missing
- [ ] Data stored in sessionStorage as `referral_you`
- [ ] Routes to `/refer-consent`

### /refer-consent
- [ ] Permission checkbox works (friend permission)
- [ ] Terms checkbox works (terms + privacy)
- [ ] Both checkboxes required to enable submit
- [ ] Submits to `/api/referrals/submit` (or logs to console if no backend)
- [ ] Routes to `/refer-confirmation` on success

### /refer-confirmation
- [ ] Shows success message
- [ ] "Refer Another" button clears sessionStorage and routes to `/refer`
- [ ] "Back to Home" button routes to `/`

## Confirmation Page (Control Center)

### Card 1: Add to Home Screen
- [ ] Title: "Add to Home Screen"
- [ ] Description explains quick access
- [ ] "Add to Home Screen" button opens AddToHomeScreen modal
- [ ] "How to add" link opens AddToHomeScreen modal

### Card 2: Your Referral Link
- [ ] Shows QR code (48x48 in white box)
- [ ] Shows code in large text (2xl font)
- [ ] "Copy Link" button works
- [ ] "Share" button works
- [ ] Code priority: partner code → user code → generate new

### Card 3: Partner Portal
- [ ] If partner exists → button says "Open Partner Portal"
- [ ] If no partner → button says "Create Partner QR"
- [ ] Button routes correctly to dashboard or signup
- [ ] Empty state message displays

### Card 4: What Happens Next
- [ ] Three numbered bullets display correctly
- [ ] Text is readable and professional

### Back to Home
- [ ] Button routes to `/`

## AddToHomeScreen Modal

### Android/Chrome
- [ ] If `beforeinstallprompt` captured → shows "Add to Home Screen" button
- [ ] Button triggers browser install prompt
- [ ] "Maybe Later" button closes modal
- [ ] On install → closes modal and calls `onComplete` callback
- [ ] `onComplete` auto-opens ShareSheetModal after 300ms

### iOS/Safari
- [ ] Shows 3-step instructions:
  1. Tap Share icon
  2. Select "Add to Home Screen"
  3. Tap "Add"
- [ ] "Done" button closes modal
- [ ] `onComplete` auto-opens ShareSheetModal

### Fallback (Other Browsers)
- [ ] Shows message: "Use your browser's menu to add HomeFront to your Home Screen."
- [ ] "Got it" button closes modal

## Main Funnel Integration

### Verify Existing Flow is Intact
- [ ] `/choose` page works (Buy/Sell/Manage)
- [ ] Mission pages work (audience, branch, location, etc.)
- [ ] Contact page gated correctly (consent + verified required)
- [ ] Verification overlay ONLY on `/verify` (not other pages)
- [ ] `/confirmation` shows redesigned Control Center (not old confetti page)
- [ ] URL params preserved for NON-PII funnel values

### URL Params Handling
- [ ] Main funnel KEEPS params: mission, audience, branch, etc.
- [ ] Refer flow does NOT put PII in params
- [ ] Partner flow does NOT use params (uses localStorage only)

## Visual Consistency

### Layout & Branding
- [ ] Logo position consistent across all pages (mt-16)
- [ ] FlowLayout used for new pages (Partner, Refer)
- [ ] PhoneShell used for confirmation page
- [ ] Background gradient consistent (#0b0f14 base)
- [ ] Font sizes match existing pages
- [ ] Button styles match (ChoiceButton conventions)
- [ ] Spacing/padding consistent

### Colors
- [ ] Primary button: #ff385c (red)
- [ ] Secondary button: white/10 with white/15 border
- [ ] Text: white with various opacity levels
- [ ] Focus rings: #ff385c/30 or white/30

### Responsive Design
- [ ] Works on mobile (320px+)
- [ ] Works on tablet
- [ ] Works on desktop
- [ ] No horizontal scroll
- [ ] Touch targets ≥44px

## Performance & Accessibility

### Performance
- [ ] PWA service worker registered correctly
- [ ] Offline support works (cached pages)
- [ ] No console errors
- [ ] No network errors (except expected API failures without backend)
- [ ] QR generation doesn't block UI

### Accessibility
- [ ] All buttons have focus states
- [ ] Keyboard navigation works
- [ ] Screen reader labels appropriate
- [ ] Color contrast meets WCAG AA
- [ ] `prefers-reduced-motion` respected

## Edge Cases

### localStorage/sessionStorage
- [ ] Works in incognito mode (or graceful fallback)
- [ ] Handles localStorage quota exceeded
- [ ] Handles JSON parse errors

### Network
- [ ] Works offline after first load (PWA cached)
- [ ] Handles failed QR generation gracefully
- [ ] Handles failed clipboard copy gracefully
- [ ] Handles Web Share API unavailable

### User Actions
- [ ] Rapid button clicking doesn't break flow
- [ ] Back button works correctly (browser history)
- [ ] Refresh preserves localStorage data
- [ ] Multiple tabs don't conflict

## Browser Compatibility

- [ ] Chrome/Android: Full features (A2HS prompt, shortcuts, Web Share)
- [ ] Safari/iOS: iOS instructions, no shortcuts (browser limitation)
- [ ] Firefox: Basic features work
- [ ] Edge: Full features (Chromium-based)

## Final Checks

- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All imports resolve correctly
- [ ] All images exist in public folder
- [ ] manifest.webmanifest valid JSON
- [ ] Server starts without errors (`npm run dev`)
- [ ] Production build works (`npm run build`)

---

## Known Limitations (By Design)

- **No backend**: All data stored in localStorage/sessionStorage
- **No authentication**: Simple passcode for partner login (old flow)
- **No database**: Referrals logged to console only
- **No email/SMS**: No notifications sent
- **iOS shortcuts**: Not supported by Safari (Android only)
- **Offline QR generation**: Requires initial online load for QRCode library

## Next Steps for Production

1. **Database Integration**: Connect to PostgreSQL/MongoDB
2. **API Development**: Implement `/api/referrals/submit`, `/api/leads/bulk`
3. **Authentication**: Replace passcode with JWT/OAuth
4. **CRM Integration**: Sync referrals to Salesforce/HubSpot
5. **Email/SMS**: Send notifications to referrers and referees
6. **Analytics**: Track QR scans, conversions, referral attribution
7. **Admin Dashboard**: View all partners and referrals
