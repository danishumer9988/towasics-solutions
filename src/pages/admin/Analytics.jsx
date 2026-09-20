import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts'
import { ANALYTICS_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, CardHeader, StatCard, Button, Badge,
  EmptyState, Skeleton, TableSkeleton, Input,
} from '../../components/admin/ui'

/* ================= helpers ================= */
const RANGES = [
  { key: 'today',     label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: '7d',        label: 'Last 7 days' },
  { key: '30d',       label: 'Last 30 days' },
  { key: '90d',       label: 'Last 90 days' },
]
const PIE_COLORS = ['#086B87', '#1AA7AD', '#44D9E7', '#6FDDEB', '#A5EEF5', '#CBD5E1']

const fmtDuration = (ms = 0) => {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}
const fmtDateTime = (d) => (d ? new Date(d).toLocaleString() : '—')

const api = (type, extra = '') =>
  axios.get(`${ANALYTICS_URL}/analytics?type=${type}${extra}`).then((r) => r.data)

/* ================= small inline components ================= */
function BreakdownCard({ title, loading, data }) {
  const chartData = (data || []).map((d) => ({ name: d._id || 'Unknown', value: d.count }))
  return (
    <Card>
      <CardHeader title={title} />
      {loading ? (
        <Skeleton className="h-64 m-5" />
      ) : chartData.length === 0 ? (
        <EmptyState icon="fa-chart-pie" title="No data yet." />
      ) : (
        <div className="p-5">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={72}
                paddingAngle={2}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-3 space-y-1.5">
            {chartData.slice(0, 5).map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-muted">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="text-ink font-medium">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

/* ================= MAIN DASHBOARD ================= */
export default function Analytics() {
  const [range, setRange] = useState('7d')
  const [summary, setSummary] = useState(null)
  const [series, setSeries] = useState([])
  const [breakdowns, setBreakdowns] = useState(null)
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const [s, ts, b, v] = await Promise.all([
          api('summary',     `&range=${range}`),
          api('timeseries',  `&range=${range}`),
          api('breakdowns',  `&range=${range}`),
          api('visitors',    `&range=${range}`),
        ])
        if (cancelled) return
        setSummary(s)
        setSeries(ts)
        setBreakdowns(b)
        setVisitors(v)
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Failed to load analytics data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [range])

  const filteredVisitors = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return visitors
    return visitors.filter((v) =>
      [v.ip, v.country, v.city, v.browser, v.os, v.visitor_id, v.device]
        .some((f) => (f || '').toLowerCase().includes(term))
    )
  }, [q, visitors])

  return (
    <AdminLayout>
      <PageHeader
        title="Analytics"
        description="Understand who visits your website and how they interact with it."
        actions={
          <div className="flex flex-wrap gap-1 bg-white border border-line rounded-lg p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition
                  ${range === r.key ? 'bg-brand-600 text-white' : 'text-ink-muted hover:bg-gray-50'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      {error && (
        <div className="mb-4">
          <Card>
            <div className="p-4 text-sm text-red-600">{error}</div>
          </Card>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {loading || !summary ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <StatCard label="Unique Visitors" value={summary.uniqueVisitors} icon="fa-user-group"       tone="brand" />
            <StatCard label="Sessions"        value={summary.sessions}       icon="fa-clock"            tone="info" />
            <StatCard label="Page Views"      value={summary.pageViews}      icon="fa-eye"              tone="success" />
            <StatCard label="Clicks"          value={summary.clicks}         icon="fa-hand-pointer"     tone="warning" />
            <StatCard label="Avg. Session"    value={fmtDuration(summary.avgSessionMs)} icon="fa-hourglass-half" tone="brand" />
          </>
        )}
      </div>

      {/* Trend chart */}
      <Card className="mb-6">
        <CardHeader title="Visitors & Page Views Over Time" />
        <div className="p-5">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : series.length === 0 ? (
            <EmptyState
              icon="fa-chart-line"
              title="No visitor activity recorded yet."
              description="Data will appear here once visitors reach your public site."
            />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#086B87" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#086B87" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1AA7AD" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1AA7AD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#98A2B3" />
                <YAxis tick={{ fontSize: 11 }} stroke="#98A2B3" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Area type="monotone" dataKey="visitors"  stroke="#086B87" fill="url(#gVisitors)" strokeWidth={2} />
                <Area type="monotone" dataKey="pageViews" stroke="#1AA7AD" fill="url(#gPages)"    strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Breakdown charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <BreakdownCard title="Devices"           loading={loading} data={breakdowns?.devices} />
        <BreakdownCard title="Browsers"          loading={loading} data={breakdowns?.browsers} />
        <BreakdownCard title="Operating Systems" loading={loading} data={breakdowns?.os} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader title="Top Pages" subtitle="Most visited routes" />
          {loading ? (
            <TableSkeleton rows={5} cols={3} />
          ) : !breakdowns?.topPages?.length ? (
            <EmptyState icon="fa-file" title="No page views yet." />
          ) : (
            <ul className="divide-y divide-line">
              {breakdowns.topPages.map((p) => (
                <li key={p._id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-ink truncate">{p._id || '/'}</span>
                  <span className="text-xs text-ink-muted shrink-0">
                    {p.views} views · {p.unique} unique
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Visitors per Browser" />
          {loading ? (
            <Skeleton className="h-64 m-5" />
          ) : !breakdowns?.browsers?.length ? (
            <EmptyState icon="fa-chart-bar" title="No browser data yet." />
          ) : (
            <div className="p-5">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={breakdowns.browsers.map((c) => ({ name: c._id || 'Other', count: c.count }))}>
                  <CartesianGrid vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#98A2B3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#98A2B3" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                  <Bar dataKey="count" fill="#086B87" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Visitor table */}
      <Card className="overflow-hidden">
        <CardHeader
          title="Visitors"
          subtitle={`${filteredVisitors.length} records`}
          actions={
            <div className="w-64">
              <Input
                placeholder="Search IP, browser, OS…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          }
        />
        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : filteredVisitors.length === 0 ? (
          <EmptyState icon="fa-user-group" title="No visitor activity recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line bg-gray-50/60">
                  <th className="px-5 py-3 font-medium">Visitor</th>
                  <th className="px-5 py-3 font-medium">Device</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Browser / OS</th>
                  <th className="px-5 py-3 font-medium">Sessions</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Views</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Clicks</th>
                  <th className="px-5 py-3 font-medium">Last Seen</th>
                  <th className="px-5 py-3 font-medium text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((v) => (
                  <tr key={v.visitor_id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink truncate max-w-[200px]">{v.ip || 'Unknown IP'}</p>
                      <p className="text-xs text-ink-subtle truncate max-w-[200px]">{v.visitor_id}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone="brand">{v.device || 'unknown'}</Badge>
                    </td>
                    <td className="px-5 py-3 text-ink-muted hidden md:table-cell">
                      {v.browser || '—'} · {v.os || '—'}
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{v.sessions ?? 0}</td>
                    <td className="px-5 py-3 text-ink-muted hidden md:table-cell">{v.pages ?? 0}</td>
                    <td className="px-5 py-3 text-ink-muted hidden md:table-cell">{v.clicks ?? 0}</td>
                    <td className="px-5 py-3 text-ink-muted">{fmtDateTime(v.last_seen)}</td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        as={Link}
                        to={`/admin/analytics/visitor/${v.visitor_id}`}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  )
}

/* ================= VISITOR DETAIL ================= */
export function VisitorDetail() {
  const { visitorId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get(
          `${ANALYTICS_URL}/analytics?type=visitor&id=${visitorId}`
        )
        if (!cancelled) setData(res.data)
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Failed to load visitor details.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [visitorId])

  const clicks = data?.activities?.filter((a) => a.type === 'click') || []

  return (
    <AdminLayout>
      <div className="mb-4">
        <Button variant="ghost" size="sm" as={Link} to="/admin/analytics">
          <i className="fa-solid fa-arrow-left"></i> Back to Analytics
        </Button>
      </div>

      <PageHeader
        title="Visitor Details"
        description={visitorId ? `Anonymous visitor ID: ${visitorId}` : ''}
      />

      {error && <Card><div className="p-6 text-red-600 text-sm">{error}</div></Card>}

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-64" />
        </div>
      ) : !data ? null : (
        <>
          <Card className="mb-6">
            <CardHeader title="Overview" />
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
              {[
                ['IP Address', data.visitor?.ip || '—'],
                ['First Visit', fmtDateTime(data.visitor?.first_seen)],
                ['Last Visit',  fmtDateTime(data.visitor?.last_seen)],
                ['Total Sessions', data.sessions?.length ?? 0],
                ['Total Page Views', data.pageViews?.length ?? 0],
                ['Total Clicks', clicks.length],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium">{k}</p>
                  <p className="text-ink mt-1 break-words">{v}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-6">
            <CardHeader title="Device & Environment" />
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
              {[
                ['Device',   data.visitor?.device || '—'],
                ['Browser',  data.visitor?.browser || '—'],
                ['OS',       data.visitor?.os || '—'],
                ['Screen',   data.visitor?.screen_w ? `${data.visitor.screen_w} × ${data.visitor.screen_h}` : '—'],
                ['Viewport', data.visitor?.viewport_w ? `${data.visitor.viewport_w} × ${data.visitor.viewport_h}` : '—'],
                ['User Agent', data.visitor?.user_agent || '—'],
              ].map(([k, v]) => (
                <div key={k} className={k === 'User Agent' ? 'col-span-2 md:col-span-4' : ''}>
                  <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium">{k}</p>
                  <p className="text-ink mt-1 break-all">{v}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="overflow-hidden">
              <CardHeader title="Activity Timeline" subtitle="Most recent events first" />
              {data.activities?.length === 0 ? (
                <EmptyState icon="fa-timeline" title="No recorded events." />
              ) : (
                <ol className="relative p-5 ml-3 border-l border-line">
                  {data.activities.slice(0, 40).map((a) => (
                    <li key={a.id} className="mb-5 ml-5">
                      <span className="absolute -left-[7px] mt-1 w-3.5 h-3.5 rounded-full bg-brand-600 border-2 border-white" />
                      <p className="text-xs text-ink-subtle">{fmtDateTime(a.timestamp)}</p>
                      <p className="text-sm font-medium text-ink mt-0.5">
                        <Badge tone={a.type === 'click' ? 'info' : 'neutral'}>{a.type}</Badge>
                        <span className="ml-2">{a.text || a.element || a.path}</span>
                      </p>
                      {a.destination && (
                        <p className="text-xs text-ink-muted mt-1 break-all">→ {a.destination}</p>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </Card>

            <Card className="overflow-hidden">
              <CardHeader title="Sessions" subtitle={`${data.sessions?.length ?? 0} total`} />
              {data.sessions?.length === 0 ? (
                <EmptyState icon="fa-clock" title="No sessions recorded." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line bg-gray-50/60">
                        <th className="px-5 py-3 font-medium">Date</th>
                        <th className="px-5 py-3 font-medium">Duration</th>
                        <th className="px-5 py-3 font-medium">Views</th>
                        <th className="px-5 py-3 font-medium">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sessions.map((s) => (
                        <tr key={s.session_id} className="border-b border-line last:border-0">
                          <td className="px-5 py-3 text-ink-muted">{fmtDateTime(s.started_at)}</td>
                          <td className="px-5 py-3">{fmtDuration(s.duration_ms)}</td>
                          <td className="px-5 py-3">{s.page_views}</td>
                          <td className="px-5 py-3">{s.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <Card className="overflow-hidden mb-6">
            <CardHeader title="Page View History" subtitle={`${data.pageViews?.length ?? 0} views`} />
            {data.pageViews?.length === 0 ? (
              <EmptyState icon="fa-file" title="No page views recorded." />
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50/90 backdrop-blur">
                    <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line">
                      <th className="px-5 py-3 font-medium">Time</th>
                      <th className="px-5 py-3 font-medium">Path</th>
                      <th className="px-5 py-3 font-medium">Title</th>
                      <th className="px-5 py-3 font-medium">Referrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pageViews.map((p) => (
                      <tr key={p.id} className="border-b border-line last:border-0">
                        <td className="px-5 py-3 text-ink-muted whitespace-nowrap">{fmtDateTime(p.timestamp)}</td>
                        <td className="px-5 py-3 text-ink font-medium">{p.path || '/'}</td>
                        <td className="px-5 py-3 text-ink-muted">{p.title || '—'}</td>
                        <td className="px-5 py-3 text-ink-muted truncate max-w-[240px]">{p.referrer || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="Click History" subtitle={`${clicks.length} clicks`} />
            {clicks.length === 0 ? (
              <EmptyState icon="fa-hand-pointer" title="No clicks recorded." />
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50/90 backdrop-blur">
                    <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line">
                      <th className="px-5 py-3 font-medium">Time</th>
                      <th className="px-5 py-3 font-medium">Page</th>
                      <th className="px-5 py-3 font-medium">Element</th>
                      <th className="px-5 py-3 font-medium">Destination</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clicks.map((a) => (
                      <tr key={a.id} className="border-b border-line last:border-0">
                        <td className="px-5 py-3 text-ink-muted whitespace-nowrap">{fmtDateTime(a.timestamp)}</td>
                        <td className="px-5 py-3 text-ink-muted">{a.path || '—'}</td>
                        <td className="px-5 py-3 text-ink">{a.text || a.element || '—'}</td>
                        <td className="px-5 py-3 text-ink-muted truncate max-w-[260px]">{a.destination || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </AdminLayout>
  )
}