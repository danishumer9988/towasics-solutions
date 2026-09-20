import { sql } from './_db.js'

/* ---------- Date range helper ---------- */
function rangeStart(range = '7d') {
  const days = {
    today: 1,
    yesterday: 2,
    '7d': 7,
    '30d': 30,
    '90d': 90,
  }[range] || 7

  const d = new Date()
  d.setDate(d.getDate() - (days - 1))
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const type = req.query.type
    const range = req.query.range || '7d'
    const start = rangeStart(range)

    /* ---------------- SUMMARY ---------------- */
    if (type === 'summary') {
      const [uv, ss, pv, cl, avg] = await Promise.all([
        sql`SELECT COUNT(*)::int AS c FROM visitors WHERE last_seen >= ${start}`,
        sql`SELECT COUNT(*)::int AS c FROM sessions WHERE started_at >= ${start}`,
        sql`SELECT COUNT(*)::int AS c FROM pageviews WHERE timestamp >= ${start}`,
        sql`SELECT COUNT(*)::int AS c FROM activities WHERE type = 'click' AND timestamp >= ${start}`,
        sql`SELECT COALESCE(AVG(duration_ms), 0)::int AS avg FROM sessions WHERE started_at >= ${start}`,
      ])

      return res.json({
        uniqueVisitors: uv[0].c,
        sessions: ss[0].c,
        pageViews: pv[0].c,
        clicks: cl[0].c,
        avgSessionMs: avg[0].avg,
      })
    }

    /* ---------------- TIMESERIES ---------------- */
    if (type === 'timeseries') {
      const rows = await sql`
        SELECT
          TO_CHAR(timestamp, 'YYYY-MM-DD') AS date,
          COUNT(*)::int AS page_views,
          COUNT(DISTINCT visitor_id)::int AS visitors
        FROM pageviews
        WHERE timestamp >= ${start}
        GROUP BY date
        ORDER BY date ASC
      `

      return res.json(
        rows.map((r) => ({
          date: r.date,
          pageViews: r.page_views,
          visitors: r.visitors,
        }))
      )
    }

    /* ---------------- VISITORS LIST ---------------- */
    if (type === 'visitors') {
      const q = (req.query.q || '').trim()

      if (q) {
        const like = `%${q}%`
        const rows = await sql`
          SELECT
            v.*,
            (SELECT COUNT(*)::int FROM sessions s
              WHERE s.visitor_id = v.visitor_id AND s.started_at >= ${start}) AS sessions,
            (SELECT COALESCE(SUM(page_views), 0)::int FROM sessions s
              WHERE s.visitor_id = v.visitor_id AND s.started_at >= ${start}) AS pages,
            (SELECT COALESCE(SUM(clicks), 0)::int FROM sessions s
              WHERE s.visitor_id = v.visitor_id AND s.started_at >= ${start}) AS clicks
          FROM visitors v
          WHERE v.last_seen >= ${start}
            AND (
              v.ip ILIKE ${like} OR
              v.browser ILIKE ${like} OR
              v.os ILIKE ${like} OR
              v.device ILIKE ${like} OR
              v.visitor_id ILIKE ${like}
            )
          ORDER BY v.last_seen DESC
          LIMIT 500
        `
        return res.json(rows)
      }

      const rows = await sql`
        SELECT
          v.*,
          (SELECT COUNT(*)::int FROM sessions s
            WHERE s.visitor_id = v.visitor_id AND s.started_at >= ${start}) AS sessions,
          (SELECT COALESCE(SUM(page_views), 0)::int FROM sessions s
            WHERE s.visitor_id = v.visitor_id AND s.started_at >= ${start}) AS pages,
          (SELECT COALESCE(SUM(clicks), 0)::int FROM sessions s
            WHERE s.visitor_id = v.visitor_id AND s.started_at >= ${start}) AS clicks
        FROM visitors v
        WHERE v.last_seen >= ${start}
        ORDER BY v.last_seen DESC
        LIMIT 500
      `
      return res.json(rows)
    }

    /* ---------------- SINGLE VISITOR DETAIL ---------------- */
    if (type === 'visitor') {
      const id = req.query.id
      if (!id) return res.status(400).json({ error: 'Missing id' })

      const [visitor, sessions, pageViews, activities] = await Promise.all([
        sql`SELECT * FROM visitors WHERE visitor_id = ${id} LIMIT 1`,
        sql`SELECT * FROM sessions WHERE visitor_id = ${id} ORDER BY started_at DESC LIMIT 100`,
        sql`SELECT * FROM pageviews WHERE visitor_id = ${id} ORDER BY timestamp DESC LIMIT 500`,
        sql`SELECT * FROM activities WHERE visitor_id = ${id} ORDER BY timestamp DESC LIMIT 500`,
      ])

      if (!visitor.length) return res.status(404).json({ error: 'Not found' })

      return res.json({
        visitor: visitor[0],
        sessions,
        pageViews,
        activities,
      })
    }

    /* ---------------- BREAKDOWNS ---------------- */
    if (type === 'breakdowns') {
      const [devices, browsers, os, topPages] = await Promise.all([
        sql`
          SELECT device AS _id, COUNT(*)::int AS count
          FROM visitors WHERE last_seen >= ${start}
          GROUP BY device ORDER BY count DESC
        `,
        sql`
          SELECT browser AS _id, COUNT(*)::int AS count
          FROM visitors WHERE last_seen >= ${start}
          GROUP BY browser ORDER BY count DESC
        `,
        sql`
          SELECT os AS _id, COUNT(*)::int AS count
          FROM visitors WHERE last_seen >= ${start}
          GROUP BY os ORDER BY count DESC
        `,
        sql`
          SELECT
            path AS _id,
            COUNT(*)::int AS views,
            COUNT(DISTINCT visitor_id)::int AS unique
          FROM pageviews
          WHERE timestamp >= ${start}
          GROUP BY path
          ORDER BY views DESC
          LIMIT 15
        `,
      ])

      return res.json({
        devices,
        browsers,
        os,
        countries: [],
        cities: [],
        topPages,
        referrers: [],
      })
    }

    return res.status(400).json({ error: 'Unknown type' })
  } catch (err) {
    console.error('[analytics] error:', err)
    return res.status(500).json({ error: 'Failed to load analytics' })
  }
}