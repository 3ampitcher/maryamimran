/**
 * UBT Sustainability booth kiosk — Google Sheet backend.
 *
 * Paste this into Extensions ▸ Apps Script on the Google Sheet that
 * should collect the responses, then deploy it as a Web app with
 * "Who has access: Anyone". See SETUP.md for the click-by-click.
 */

const SHEET_NAME = 'Responses';
const LABELS = { 4: 'Great', 3: 'Good', 2: 'Not great', 1: 'Bad' };
const RECENT = 500;            // rows handed back for the charts and feed

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Time', 'Rating', 'Score', 'Date', 'Hour']);
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 160);
  }
  return sh;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** The kiosk posts one tap, or a batch of taps it had queued offline. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
  } catch (err) {
    return json({ ok: false, error: 'busy' });     // kiosk keeps it queued
  }
  try {
    const body = JSON.parse(e.postData.contents);
    const list = Array.isArray(body) ? body : [body];
    const tz = Session.getScriptTimeZone();
    const rows = [];

    list.slice(0, 500).forEach(function (v) {
      const score = Number(v.rating);
      if (!LABELS[score]) return;                  // ignore anything else
      let when = v.ts ? new Date(v.ts) : new Date();
      if (isNaN(when.getTime())) when = new Date();
      rows.push([
        when,
        LABELS[score],
        score,
        Utilities.formatDate(when, tz, 'yyyy-MM-dd'),
        Number(Utilities.formatDate(when, tz, 'H')),
      ]);
    });

    if (rows.length) {
      const sh = getSheet();
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
    }
    return json({ ok: true, saved: rows.length });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** The results page asks for the running totals. */
function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : '';
  if (action !== 'results') {
    return json({ ok: true, message: 'UBT booth kiosk endpoint' });
  }

  const sh = getSheet();
  const last = sh.getLastRow();
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const rows = [];
  let total = 0, today = 0;

  if (last > 1) {
    const values = sh.getRange(2, 1, last - 1, 3).getValues();
    const tz = Session.getScriptTimeZone();
    const todayKey = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

    // The day is always derived from the timestamp, never from the
    // date column, which Sheets is free to reformat.
    values.forEach(function (r, i) {
      const score = Number(r[2]);
      if (!LABELS[score]) return;
      const d = (r[0] instanceof Date) ? r[0] : new Date(r[0]);
      if (isNaN(d.getTime())) return;

      total++;
      counts[score]++;
      if (Utilities.formatDate(d, tz, 'yyyy-MM-dd') === todayKey) today++;
      if (i >= values.length - RECENT) {
        rows.push({ rating: score, ts: d.toISOString() });
      }
    });
  }

  return json({ ok: true, total: total, today: today, counts: counts, rows: rows });
}
