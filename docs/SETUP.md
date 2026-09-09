# Booth feedback kiosk — setup

Two things: a **Google Sheet** that collects the taps, and this **page**,
which anyone can open with no login. Takes about five minutes.

---

## 1. Make the Sheet collect responses

1. Open a new Google Sheet — type `sheets.new` in the address bar. Name it
   something like **Booth feedback**.
2. In that Sheet: **Extensions ▸ Apps Script**.
3. Delete whatever code is in the editor, paste in everything from
   [`apps-script.gs`](apps-script.gs), and click the save icon.
4. Click **Deploy ▸ New deployment**.
   - Click the gear next to "Select type" and choose **Web app**.
   - **Execute as:** Me
   - **Who has access:** **Anyone** ← this is the one that matters. Not
     "Anyone with Google account".
   - Click **Deploy**.
5. Google asks you to authorise it. Choose your account, then
   **Advanced ▸ Go to (project name) (unsafe) ▸ Allow**. That warning is
   normal — the "unverified app" is the script you just pasted.
6. Copy the **Web app URL**. It ends in `/exec`.

## 2. Connect the page to the Sheet

Open `docs/index.html` and find this near the top of the `<script>`:

```js
const API = "PASTE_YOUR_WEB_APP_URL_HERE";
```

Paste your `/exec` URL between the quotes. While you're there you can also
set `SHEET_URL` to your Sheet's link — that turns on the "Open the Google
Sheet" button on the results page. Commit and push.

## 3. Put the page online

On GitHub: **Settings ▸ Pages**.

- **Source:** Deploy from a branch
- **Branch:** `claude/funny-dirac-objvrr`, folder **`/docs`**
- **Save**

A minute later the kiosk is live at:

**`https://3ampitcher.github.io/maryamimran/`**

That link opens for anyone, on any device, with no login — and every tablet
that has it open writes into the same Sheet, so the results page shows the
combined total.

---

## Using it

- **Kiosk:** open the link, put the browser in fullscreen, leave it on the table.
- **Results:** press and hold the small dot in the **bottom-right corner** for
  about a second. Escape or "← Back to kiosk" returns.
- **Connection:** the small dot above the buttons is green when taps are
  reaching the Sheet, grey when they're being held on the tablet. Held taps
  sync by themselves — nothing is lost if the wifi drops mid-booth.
- **Clearing responses:** delete the rows in the Sheet. There's deliberately
  no clear button on the page, because the page is public and anyone with the
  link could press it.

## If you change `apps-script.gs` later

Edits don't go live until you redeploy: **Deploy ▸ Manage deployments ▸**
pencil icon **▸ Version: New version ▸ Deploy**. The URL stays the same.

## Worth knowing

- Responses are anonymous — the rating and the time it was tapped, nothing
  about the person. That's stated on the results page.
- The link is public, so someone who finds it could add junk responses. For a
  booth that's a fair trade; if it ever matters, delete the rows in the Sheet.
