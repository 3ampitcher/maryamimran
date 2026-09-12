# Booth feedback kiosk — setup

One page. Responses are saved **in the browser on the tablet you run it on**
and are never sent anywhere — no account, no server, no Google, no network
needed once the page has loaded.

---

## Put it online

On GitHub: **Settings ▸ Pages**.

- **Source:** Deploy from a branch
- **Branch:** `claude/funny-dirac-objvrr`, folder **`/docs`**
- **Save**

A minute later the kiosk is live at:

**`https://3ampitcher.github.io/maryamimran/`**

Anyone can open that link on any device, with no login. Each device keeps its
own responses.

## On the day

1. Open the link on the tablet **in a normal browser window** — not private /
   incognito, which throws the responses away.
2. Put the browser in fullscreen and leave it on the table.
3. Don't clear the browser's history or site data while the booth is running.

## Reading the results

Press and hold the small dot in the **bottom-right corner** for about a
second. Escape or "← Back to kiosk" returns you to the faces.

The results page has:

- **Positive** — Great + Good as a share of everything
- **Total** and **today's** count
- The breakdown per face, responses by hour, and the latest taps with times
- **Download CSV** — do this at the end of the day. It's the only copy.
- **Clear all responses** — two presses, and it only clears this tablet

## The two lights

- The dot **above the buttons** on the kiosk: green means responses are being
  saved, grey means the browser is refusing to save and they'll vanish when the
  page closes. If it's grey, you're probably in a private window.
- The label at the top of the results page says the same thing.

## Worth knowing

- **Responses are anonymous** — the rating and the time it was tapped, nothing
  about the person. That's stated on the results page.
- **Each device is separate.** Two tablets means two sets of results. Download
  both CSVs and add them together if you run more than one.
- **The data lives only in that browser.** Clearing site data, or "reset the
  tablet", deletes it. Download the CSV before you pack up.

---

## Optional: pooling responses across devices

Not set up, and not needed for a single-tablet booth. `apps-script.gs` in this
folder is a Google Sheet backend from an earlier version — if you ever want
every tablet writing into one Sheet, that file plus the git history of
`docs/index.html` has what's needed. Ask and I'll wire it back in.

If you already deployed that Apps Script, it's worth deleting the deployment
now (**Deploy ▸ Manage deployments ▸** trash icon). It's a public URL that can
write to your Sheet, and nothing is using it any more.
