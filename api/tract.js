import { sql } from './_db.js'

/* ---------- User-agent parsing (no external deps) ---------- */
function parseUA(ua = '') {
  const lower = ua.toLowerCase()

  const device =
    /mobile|android|iphone|ipod|blackberry|opera mini/i.test(lower) ? 'mobile'
    : /ipad|tablet/i.test(lower) ? 'tablet'
    : 'desktop'

  let browser = 'Other'
  if (/edg\//i.test(lower))          browser = 'Edge'
  else if (/chrome|crios/i.test(lower)) browser = 'Chrome'
  else if (/firefox|fxios/i.test(lower)) browser = 'Firefox'
  else if (/safari/i.test(lower))    browser = 'Safari'
  else if (/opr\//i.test(lower))     browser = 'Opera'

  let os = 'Other'
  if (/windows/i.test(lower))                       os = 'Windows'
  else if (/mac os|macintosh/i.test(lower))         os = 'macOS'
  else if (/android/i.test(lower))                  os = 'Android'
  else if (/iphone|ipad|ipod/i.test(lower))         os = 'iOS'
  else if (/linux/i.test(lower))                    os = 'Linux'

  return { device, browser, os }
}

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const d = req.body || {}
    const {
      type,
      visitorId,
      sessionId,
      url,
      path,
      title,
      referrer,
      screen,
      viewport,
      // click-specific
      element,
      text,
      destination,
    } = d

    if (!visitorId || !sessionId || !type) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' })
    }

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || ''
    const ua = req.headers['user-agent'] || ''
    const { device, browser, os } = parseUA(ua)

    /* ---------------- PAGE VIEW ---------------- */
    if (type === 'pageview') {
      // Upsert visitor
      await sql`
        INSERT INTO visitors (
          visitor_id, ip, user_agent, device, browser, os,
          screen_w, screen_h, viewport_w, viewport_h
        )
        VALUES (
          ${visitorId}, ${ip}, ${ua}, ${device}, ${browser}, ${os},
          ${screen?.w ?? null}, ${screen?.h ?? null},
          ${viewport?.w ?? null}, ${viewport?.h ?? null}
        )
        ON CONFLICT (visitor_id) DO UPDATE SET
          ip = EXCLUDED.ip,
          user_agent = EXCLUDED.user_agent,
          device = EXCLUDED.device,
          browser = EXCLUDED.browser,
          os = EXCLUDED.os,
          screen_w = COALESCE(EXCLUDED.screen_w, visitors.screen_w),
          screen_h = COALESCE(EXCLUDED.screen_h, visitors.screen_h),
          viewport_w = COALESCE(EXCLUDED.viewport_w, visitors.viewport_w),
          viewport_h = COALESCE(EXCLUDED.viewport_h, visitors.viewport_h),
          last_seen = NOW()
      `

      // Session — insert or extend
      const existing = await sql`
        SELECT session_id, ended_at, duration_ms
        FROM sessions
        WHERE session_id = ${sessionId}
        LIMIT 1
      `

      if (existing.length === 0) {
        await sql`
          INSERT INTO sessions (
            session_id, visitor_id, landing_page, exit_page, referrer, page_views
          )
          VALUES (
            ${sessionId}, ${visitorId}, ${path || '/'}, ${path || '/'},
            ${referrer || ''}, 1
          )
        `
      } else {
        const row = existing[0]
        const lastTs = row.ended_at ? new Date(row.ended_at).getTime() : Date.now()
        const idleMs = Math.min(Date.now() - lastTs, 30 * 60 * 1000) // cap at 30 min
        const duration = (row.duration_ms || 0) + (idleMs > 0 ? idleMs : 0)

        await sql`
          UPDATE sessions
          SET ended_at = NOW(),
              duration_ms = ${duration},
              exit_page = ${path || '/'},
              page_views = page_views + 1
          WHERE session_id = ${sessionId}
        `
      }

      // Page view row
      await sql`
        INSERT INTO pageviews (visitor_id, session_id, url, path, title, referrer)
        VALUES (
          ${visitorId}, ${sessionId}, ${url || ''}, ${path || '/'},
          ${title || ''}, ${referrer || ''}
        )
      `
    }

    /* ---------------- CLICK EVENT ---------------- */
    else if (type === 'click') {
      await sql`
        INSERT INTO activities (
          visitor_id, session_id, type, path, url, element, text, destination
        )
        VALUES (
          ${visitorId}, ${sessionId}, 'click', ${path || ''}, ${url || ''},
          ${element || ''}, ${text || ''}, ${destination || ''}
        )
      `

      await sql`
        UPDATE sessions
        SET clicks = clicks + 1,
            ended_at = NOW()
        WHERE session_id = ${sessionId}
      `
    }

    else {
      return res.status(400).json({ ok: false, error: 'Unknown type' })
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error('[track] error:', err)
    return res.status(500).json({ ok: false })
  }
}