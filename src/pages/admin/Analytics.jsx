import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { ANALYTICS_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, CardHeader, StatCard, Button, Badge,
  EmptyState, Skeleton, TableSkeleton, Input, ConfirmDialog, Alert,
} from '../../components/admin/ui'
import { exportData, DownloadMenu } from '../../lib/exportData'

/* ================= helpers ================= */
const RANGES = [
  { key: 'today',     label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: '7d',        label: 'Last 7 days' },
  { key: '30d',       label: 'Last 30 days' },
  { key: '90d',       label: 'Last 90 days' },
]
const PIE_COLORS = ['#086B87', '#1AA7AD', '#44D9E7', '#6FDDEB', '#A5EEF5', '#CBD5E1']
const ACTIVE_MS = 5 * 60 * 1000

const REGION_NAMES = {
  PB: 'Punjab', SD: 'Sindh', IS: 'Islamabad', KP: 'Khyber Pakhtunkhwa',
  BA: 'Balochistan', GB: 'Gilgit-Baltistan', TA: 'FATA', JK: 'Azad Kashmir',
  CA: 'California', NY: 'New York', TX: 'Texas', FL: 'Florida', WA: 'Washington',
  IL: 'Illinois', PA: 'Pennsylvania', OH: 'Ohio', GA: 'Georgia', NC: 'North Carolina',
  MI: 'Michigan', NJ: 'New Jersey', VA: 'Virginia', AZ: 'Arizona', MA: 'Massachusetts',
  ENG: 'England', SCT: 'Scotland', WLS: 'Wales', NIR: 'Northern Ireland',
  ON: 'Ontario', QC: 'Quebec', BC: 'British Columbia', AB: 'Alberta',
  DXB: 'Dubai', AUH: 'Abu Dhabi', SHJ: 'Sharjah',
  MH: 'Maharashtra', UP: 'Uttar Pradesh', DL: 'Delhi', KA: 'Karnataka',
  NSW: 'New South Wales', VIC: 'Victoria', QLD: 'Queensland',
}
const regionLabel = (code) => REGION_NAMES[code] || code || 'Unknown'

const fmtDuration = (ms = 0) => {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}
const fmtDateTime = (d) => (d ? new Date(d).toLocaleString() : '—')
const fmtPct = (n) => `${Math.round((n || 0) * 100)}%`
const isActive = (v) => v.last_seen && Date.now() - new Date(v.last_seen).getTime() < ACTIVE_MS

const authHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const api = (type, extra = '') =>
  axios
    .get(`${ANALYTICS_URL}/analytics?type=${type}${extra}`, { headers: authHeaders() })
    .then((r) => r.data)

/* ================= Map tiles ================= */
function MapTiles({ layer }) {
  if (layer === 'satellite') {
    return (
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxNativeZoom={19}
        maxZoom={22}
      />
    )
  }
  return (
    <TileLayer
      attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      maxNativeZoom={20}
      maxZoom={22}
    />
  )
}

function LayerToggle({ layer, onChange }) {
  return (
    <div className="absolute top-3 right-3 z-[400] flex bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <button type="button" onClick={() => onChange('streets')}
        className={`px-3 py-1.5 text-xs font-semibold transition ${layer === 'streets' ? 'bg-[#0a85a7] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
        <i className="fa-solid fa-map mr-1"></i> Streets
      </button>
      <button type="button" onClick={() => onChange('satellite')}
        className={`px-3 py-1.5 text-xs font-semibold transition ${layer === 'satellite' ? 'bg-[#0a85a7] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
        <i className="fa-solid fa-satellite mr-1"></i> Satellite
      </button>
    </div>
  )
}

/* ================= Live visitors map ================= */
function VisitorsMap({ visitors, height = 420 }) {
  const [layer, setLayer] = useState('streets')

  const withCoords = (visitors || []).filter(
    (v) => typeof v.lat === 'number' && typeof v.lon === 'number'
  )

  if (withCoords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-200" style={{ height }}>
        <i className="fa-solid fa-earth-americas text-3xl text-gray-300 mb-3"></i>
        <p className="text-sm text-gray-500 font-medium">No location data yet</p>
        <p className="text-xs text-gray-400 mt-1">Locations appear once visitors grant permission or their IP is resolved</p>
      </div>
    )
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-line" style={{ height }}>
      <LayerToggle layer={layer} onChange={setLayer} />
      <MapContainer center={[30, 70]} zoom={3} minZoom={2} maxZoom={22} scrollWheelZoom
        style={{ height: '100%', width: '100%' }}>
        <MapTiles layer={layer} />
        {withCoords.map((v) => {
          const active = isActive(v)
          return (
            <CircleMarker key={v.visitor_id} center={[v.lat, v.lon]}
              radius={active ? 9 : 6}
              pathOptions={{
                color: active ? '#10b981' : '#0866ff',
                fillColor: active ? '#10b981' : '#0866ff',
                fillOpacity: active ? 0.9 : 0.7,
                weight: 3,
              }}>
              <Popup>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                  <strong style={{ color: '#086B87' }}>
                    {v.city || 'Unknown city'}{v.region ? `, ${regionLabel(v.region)}` : ''}
                  </strong><br />
                  {v.countryName || v.country || 'Unknown country'}<br />
                  <span style={{ color: '#6b7280' }}>IP: {v.ip || '—'}</span><br />
                  <span style={{ color: '#6b7280' }}>
                    {active ? '🟢 Active now' : `Last seen: ${fmtDateTime(v.last_seen)}`}
                  </span><br />
                  <span style={{ color: '#6b7280' }}>
                    Coordinates: {v.lat.toFixed(4)}, {v.lon.toFixed(4)}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}

/* ================= small components ================= */
function BreakdownCard({ title, loading, data }) {
  const chartData = (data || []).map((d) => ({
    name: typeof d._id === 'object' ? d._id?.name || d._id?.code || 'Unknown' : d._id || 'Unknown',
    value: d.count,
  }))
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
              <Pie data={chartData} dataKey="value" nameKey="name"
                innerRadius={42} outerRadius={72} paddingAngle={2}>
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
                  <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
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

function ListCard({ title, subtitle, loading, items, emptyText }) {
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      {loading ? (
        <TableSkeleton rows={5} cols={2} />
      ) : !items?.length ? (
        <EmptyState icon="fa-list" title={emptyText || 'No data yet.'} />
      ) : (
        <ul className="divide-y divide-line">
          {items.map((p, idx) => (
            <li key={idx} className="px-5 py-3 flex items-center justify-between gap-3">
              <span className="text-sm text-ink truncate">{p._id || '/'}</span>
              <span className="text-xs text-ink-muted shrink-0">
                {p.views ?? p.count} {p.unique !== undefined ? `· ${p.unique} unique` : ''}
              </span>
            </li>
          ))}
        </ul>
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
  const [toast, setToast] = useState(null)
  const [q, setQ] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [deviceFilter, setDeviceFilter] = useState('all')
  const [selected, setSelected] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(null) // { ids: [...] } | null
  const [deleting, setDeleting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError('')
      try {
        const [s, ts, b, v] = await Promise.all([
          api('summary',    `&range=${range}`),
          api('timeseries', `&range=${range}`),
          api('breakdowns', `&range=${range}`),
          api('visitors',   `&range=${range}`),
        ])
        if (cancelled) return
        setSummary(s)
        setSeries(ts)
        setBreakdowns(b)
        setVisitors(Array.isArray(v) ? v : [])
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Failed to load analytics data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [range, reloadKey])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])

  const activeVisitors = useMemo(() => visitors.filter(isActive), [visitors])

  /* Filter options derived from data */
  const countryOptions = useMemo(
    () => Array.from(new Set(visitors.map(v => v.countryName || v.country).filter(Boolean))).sort(),
    [visitors]
  )
  const cityOptions = useMemo(
    () => Array.from(new Set(visitors.map(v => v.city).filter(Boolean))).sort(),
    [visitors]
  )
  const deviceOptions = useMemo(
    () => Array.from(new Set(visitors.map(v => v.device).filter(Boolean))).sort(),
    [visitors]
  )

  /* Filtered visitors */
  const filteredVisitors = useMemo(() => {
    const term = q.trim().toLowerCase()
    return visitors.filter((v) => {
      if (term) {
        const hay = [v.ip, v.country, v.countryName, v.region, v.city, v.browser, v.os, v.visitor_id, v.device]
          .map(x => (x || '').toString().toLowerCase())
        if (!hay.some(f => f.includes(term))) return false
      }
      if (countryFilter !== 'all' && (v.countryName || v.country) !== countryFilter) return false
      if (cityFilter !== 'all' && v.city !== cityFilter) return false
      if (deviceFilter !== 'all' && v.device !== deviceFilter) return false
      return true
    })
  }, [visitors, q, countryFilter, cityFilter, deviceFilter])

  /* Selection */
  const filteredIds = useMemo(() => filteredVisitors.map(v => v.visitor_id), [filteredVisitors])
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selected.includes(id))
  const someSelected = selected.length > 0 && !allSelected

  const toggleAll = () => {
    if (allSelected) {
      setSelected(prev => prev.filter(id => !filteredIds.includes(id)))
    } else {
      setSelected(prev => Array.from(new Set([...prev, ...filteredIds])))
    }
  }
  const toggleOne = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  /* Download */
  const exportColumns = [
    { label: 'Visitor ID',   key: 'visitor_id' },
    { label: 'Status',       value: (r) => isActive(r) ? 'Active' : 'Inactive' },
    { label: 'IP',           key: 'ip' },
    { label: 'Country',      value: (r) => r.countryName || r.country || '' },
    { label: 'Region',       value: (r) => r.region ? regionLabel(r.region) : '' },
    { label: 'City',         key: 'city' },
    { label: 'Latitude',     value: (r) => typeof r.lat === 'number' ? r.lat : '' },
    { label: 'Longitude',    value: (r) => typeof r.lon === 'number' ? r.lon : '' },
    { label: 'Geo Source',   key: 'geoSource' },
    { label: 'Device',       key: 'device' },
    { label: 'Browser',      key: 'browser' },
    { label: 'OS',           key: 'os' },
    { label: 'Sessions',     value: (r) => r.sessions ?? 0 },
    { label: 'Page Views',   value: (r) => r.pages ?? 0 },
    { label: 'Clicks',       value: (r) => r.clicks ?? 0 },
    { label: 'First Seen',   value: (r) => r.first_seen ? new Date(r.first_seen).toLocaleString() : '' },
    { label: 'Last Seen',    value: (r) => r.last_seen ? new Date(r.last_seen).toLocaleString() : '' },
  ]

  const handleDownload = (format) => {
    const rows = selected.length > 0
      ? filteredVisitors.filter(v => selected.includes(v.visitor_id))
      : filteredVisitors
    const stamp = new Date().toISOString().slice(0, 10)
    const tag = selected.length > 0 ? `selected-${rows.length}` : `all-${rows.length}`
    exportData(rows, exportColumns, format, `analytics-visitors-${tag}-${stamp}`, 'Visitor Analytics')
  }

  /* Delete */
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      const ids = confirmDelete.ids
      if (ids.length === 1) {
        await axios.delete(`${ANALYTICS_URL}/analytics/visitor/${ids[0]}`, { headers: authHeaders() })
      } else {
        await axios.post(`${ANALYTICS_URL}/analytics/visitors/delete`, { ids }, { headers: authHeaders() })
      }
      setToast({ type: 'success', message: `Deleted ${ids.length} visitor${ids.length === 1 ? '' : 's'}` })
      setSelected(prev => prev.filter(id => !ids.includes(id)))
      setConfirmDelete(null)
      refresh()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete' })
    } finally {
      setDeleting(false)
    }
  }

  const resetFilters = () => {
    setQ('')
    setCountryFilter('all')
    setCityFilter('all')
    setDeviceFilter('all')
  }

  const fmtCountry = (c) => {
    if (typeof c._id === 'object' && c._id) {
      return c._id.name || c._id.code || 'Unknown'
    }
    return c._id || 'Unknown'
  }

  return (
    <AdminLayout>
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <div className={`flex items-start gap-3 min-w-[280px] px-4 py-3 rounded-xl shadow-lg border bg-white ${
            toast.type === 'success' ? 'border-emerald-100' : 'border-red-100'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
            }`}>
              <i className={`fa-solid ${toast.type === 'success' ? 'fa-check text-emerald-500' : 'fa-xmark text-red-500'}`}></i>
            </div>
            <p className="text-sm text-ink mt-1">{toast.message}</p>
          </div>
        </div>
      )}

      <PageHeader
        title="Analytics"
        description="Track who visits your site, where they are, and what they do."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {!loading && summary && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {summary.activeNow || 0} active now
              </span>
            )}
            <div className="flex flex-wrap gap-1 bg-white border border-line rounded-lg p-1">
              {RANGES.map((r) => (
                <button key={r.key} onClick={() => setRange(r.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition
                    ${range === r.key ? 'bg-brand-600 text-white' : 'text-ink-muted hover:bg-gray-50'}`}>
                  {r.label}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
              <i className="fa-solid fa-rotate-right mr-1.5"></i>
              Refresh
            </Button>
          </div>
        }
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      {/* Primary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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

      {/* Advanced stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading || !summary ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          <>
            <StatCard label="Bounce Rate"        value={fmtPct(summary.bounceRate)} icon="fa-arrow-right-from-bracket" tone="warning" />
            <StatCard label="New Visitors"       value={summary.newVisitors}        icon="fa-user-plus"                tone="success" />
            <StatCard label="Returning Visitors" value={summary.returningVisitors}  icon="fa-rotate-right"             tone="info" />
            <StatCard label="Avg. Pages/Session" value={summary.avgPagesPerSession} icon="fa-file-lines"               tone="brand" />
          </>
        )}
      </div>

      {/* ===================== LIVE MAP ===================== */}
      <Card className="mb-6">
        <CardHeader
          title="Live Visitor Map"
          subtitle="Green = active in last 5 min · Blue = inactive"
          actions={
            <div className="flex items-center gap-3 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0866ff]" /> Inactive
              </span>
            </div>
          }
        />
        <div className="p-5">
          {loading ? <Skeleton className="h-96 w-full" /> : <VisitorsMap visitors={visitors} />}
        </div>
      </Card>

      {/* ===================== LIVE NOW PANEL ===================== */}
      {!loading && activeVisitors.length > 0 && (
        <Card className="mb-6">
          <CardHeader
            title="Live Now"
            subtitle={`${activeVisitors.length} visitor${activeVisitors.length === 1 ? '' : 's'} active in the last 5 min`}
          />
          <ul className="divide-y divide-line">
            {activeVisitors.slice(0, 8).map((v) => (
              <li key={v.visitor_id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-ink font-medium truncate">
                    {[v.city, regionLabel(v.region), v.countryName || v.country].filter(Boolean).join(', ') || 'Unknown location'}
                  </p>
                  <p className="text-xs text-ink-subtle truncate">
                    {v.ip} · {v.browser} on {v.os} · {v.device}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                  <Link to={`/admin/analytics/visitor/${v.visitor_id}`}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700">
                    Details →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Trend chart */}
      <Card className="mb-6">
        <CardHeader title="Visitors & Page Views Over Time" />
        <div className="p-5">
          {loading ? <Skeleton className="h-64 w-full" /> :
           series.length === 0 ? (
            <EmptyState icon="fa-chart-line"
              title="No visitor activity recorded yet."
              description="Data will appear here once visitors reach your public site." />
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

      {/* ===================== GEO CARDS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ListCard title="Top Countries" subtitle="By visitor count" loading={loading}
          items={(breakdowns?.countries || []).map(c => ({ _id: fmtCountry(c), count: c.count }))}
          emptyText="No country data yet." />
        <ListCard title="Top Regions / States" subtitle="By visitor count" loading={loading}
          items={(breakdowns?.regions || []).map(r => ({ _id: regionLabel(r._id), count: r.count }))}
          emptyText="No region data yet." />
        <ListCard title="Top Cities" subtitle="By visitor count" loading={loading}
          items={breakdowns?.cities} emptyText="No city data yet." />
      </div>

      {/* Hourly activity */}
      <Card className="mb-6">
        <CardHeader title="Hourly Activity" subtitle="Page views by hour of day" />
        <div className="p-5">
          {loading ? <Skeleton className="h-56 w-full" /> :
           !breakdowns?.hourly?.some((h) => h.count > 0) ? (
            <EmptyState icon="fa-clock" title="No hourly data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={breakdowns.hourly}>
                <CartesianGrid vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#98A2B3" tickFormatter={(h) => `${h}:00`} />
                <YAxis tick={{ fontSize: 11 }} stroke="#98A2B3" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
                  labelFormatter={(h) => `${h}:00 – ${h}:59`} />
                <Bar dataKey="count" fill="#1AA7AD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Pie breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <BreakdownCard title="Devices"           loading={loading} data={breakdowns?.devices} />
        <BreakdownCard title="Browsers"          loading={loading} data={breakdowns?.browsers} />
        <BreakdownCard title="Operating Systems" loading={loading} data={breakdowns?.os} />
      </div>

      {/* Lists row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ListCard title="Top Pages"     subtitle="Most visited routes"      loading={loading} items={breakdowns?.topPages} />
        <ListCard title="Top Referrers" subtitle="Where visitors come from" loading={loading} items={breakdowns?.referrers} emptyText="No referrer data yet." />
      </div>

      {/* Lists row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ListCard title="Entry Pages" subtitle="Where sessions begin" loading={loading} items={breakdowns?.entryPages} emptyText="No entry data yet." />
        <ListCard title="Exit Pages"  subtitle="Where sessions end"   loading={loading} items={breakdowns?.exitPages}  emptyText="No exit data yet." />
      </div>

      {/* ===================== VISITOR TABLE ===================== */}
      <Card className="overflow-hidden">
        <CardHeader
          title="Visitors"
          subtitle={`${filteredVisitors.length} of ${visitors.length} shown${selected.length > 0 ? ` · ${selected.length} selected` : ''}`}
          actions={
            <div className="flex items-center gap-2">
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete({ ids: selected })}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition inline-flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-trash"></i>
                  Delete {selected.length}
                </button>
              )}
              <DownloadMenu
                onDownload={handleDownload}
                disabled={filteredVisitors.length === 0}
                label={selected.length > 0 ? `Download (${selected.length})` : 'Download'}
              />
            </div>
          }
        />

        {/* ---------- Filter bar ---------- */}
        <div className="px-5 py-4 border-b border-line flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">Search</label>
            <Input placeholder="Search IP, city, browser…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="w-[160px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">Country</label>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              <option value="all">All countries</option>
              {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-[160px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">City</label>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              <option value="all">All cities</option>
              {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-[150px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">Device</label>
            <select value={deviceFilter} onChange={(e) => setDeviceFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              <option value="all">All devices</option>
              {deviceOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button type="button" onClick={resetFilters}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-line bg-white hover:bg-gray-50 transition">
            <i className="fa-solid fa-xmark mr-1"></i> Reset
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : filteredVisitors.length === 0 ? (
          <EmptyState icon="fa-user-group" title="No visitors match your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line bg-gray-50/60">
                  <th className="px-5 py-3 font-medium w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={el => { if (el) el.indeterminate = someSelected }}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Location</th>
                  <th className="px-3 py-3 font-medium">IP / Visitor</th>
                  <th className="px-3 py-3 font-medium hidden md:table-cell">Device</th>
                  <th className="px-3 py-3 font-medium hidden lg:table-cell">Sessions</th>
                  <th className="px-3 py-3 font-medium hidden lg:table-cell">Views</th>
                  <th className="px-3 py-3 font-medium">Last Seen</th>
                  <th className="px-3 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((v) => {
                  const active = isActive(v)
                  const isSel = selected.includes(v.visitor_id)
                  const location = [v.city, regionLabel(v.region), v.countryName || v.country].filter(Boolean).join(', ') || '—'
                  return (
                    <tr key={v.visitor_id} className={`border-b border-line last:border-0 hover:bg-gray-50/60 ${isSel ? 'bg-brand-50/40' : ''}`}>
                      <td className="px-5 py-3">
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleOne(v.visitor_id)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-3">
                        {active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                            <span className="w-2 h-2 rounded-full bg-gray-300" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-ink truncate max-w-[220px]">{location}</p>
                        {typeof v.lat === 'number' && (
                          <a href={`https://www.google.com/maps?q=${v.lat},${v.lon}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-xs text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
                            <i className="fa-solid fa-location-dot"></i>
                            {v.lat.toFixed(3)}, {v.lon.toFixed(3)}
                          </a>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-ink-muted text-xs truncate max-w-[160px]">{v.ip || 'Unknown IP'}</p>
                        <p className="text-ink-subtle text-[10px] truncate max-w-[160px]">{v.visitor_id}</p>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <Badge tone="brand">{v.device || 'unknown'}</Badge>
                      </td>
                      <td className="px-3 py-3 text-ink-muted hidden lg:table-cell">{v.sessions ?? 0}</td>
                      <td className="px-3 py-3 text-ink-muted hidden lg:table-cell">{v.pages ?? 0}</td>
                      <td className="px-3 py-3 text-ink-muted whitespace-nowrap">{fmtDateTime(v.last_seen)}</td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <Button variant="ghost" size="sm" as={Link}
                            to={`/admin/analytics/visitor/${v.visitor_id}`}>
                            Details
                          </Button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete({ ids: [v.visitor_id] })}
                            title="Delete visitor"
                            className="w-8 h-8 flex items-center justify-center rounded-md text-red-600 hover:bg-red-50 transition"
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ---------- Delete confirmation ---------- */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        busy={deleting}
        title="Delete visitor data"
        message={
          confirmDelete
            ? `Delete ${confirmDelete.ids.length} visitor${confirmDelete.ids.length === 1 ? '' : 's'} and all their sessions, page views and clicks? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete permanently"
      />
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
  const [layer, setLayer] = useState('streets')

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError('')
      try {
        const res = await axios.get(
          `${ANALYTICS_URL}/analytics?type=visitor&id=${visitorId}`,
          { headers: authHeaders() }
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
  const visitor = data?.visitor
  const hasCoords = typeof visitor?.lat === 'number' && typeof visitor?.lon === 'number'
  const active = visitor ? isActive(visitor) : false

  return (
    <AdminLayout>
      <div className="mb-4">
        <Button variant="ghost" size="sm" as={Link} to="/admin/analytics">
          <i className="fa-solid fa-arrow-left"></i> Back to Analytics
        </Button>
      </div>

      <PageHeader
        title="Visitor Details"
        description={visitorId ? `Visitor ID: ${visitorId}` : ''}
        actions={
          visitor && (
            active ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active now
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Inactive
              </span>
            )
          )
        }
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
            <CardHeader
              title="Location"
              subtitle={
                hasCoords
                  ? (visitor.geoSource === 'gps'
                      ? `📍 GPS precision${visitor.accuracy ? ` (≈ ${Math.round(visitor.accuracy)} m)` : ''}`
                      : '🌐 Approximate (IP-based)')
                  : 'No coordinates captured'
              }
            />
            <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {hasCoords ? (
                  <div className="relative rounded-lg overflow-hidden border border-line" style={{ height: 320 }}>
                    <LayerToggle layer={layer} onChange={setLayer} />
                    <MapContainer center={[visitor.lat, visitor.lon]} zoom={14} minZoom={2} maxZoom={22} scrollWheelZoom
                      style={{ height: '100%', width: '100%' }}>
                      <MapTiles layer={layer} />
                      <CircleMarker center={[visitor.lat, visitor.lon]} radius={12}
                        pathOptions={{
                          color: active ? '#10b981' : '#0866ff',
                          fillColor: active ? '#10b981' : '#0866ff',
                          fillOpacity: 0.75,
                          weight: 3,
                        }}>
                        <Popup>
                          {visitor.city || 'Unknown city'}
                          {visitor.region ? `, ${regionLabel(visitor.region)}` : ''}
                          <br />
                          {visitor.countryName || visitor.country || ''}
                        </Popup>
                      </CircleMarker>
                    </MapContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-200" style={{ height: 320 }}>
                    <i className="fa-solid fa-location-slash text-3xl text-gray-300 mb-3"></i>
                    <p className="text-sm text-gray-500 font-medium">No coordinates captured</p>
                    <p className="text-xs text-gray-400 mt-1">This visitor declined location or their IP could not be resolved</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5 text-sm content-start">
                {[
                  ['Country', visitor.countryName || visitor.country || '—'],
                  ['Country Code', visitor.country || '—'],
                  ['Region / State', visitor.region ? regionLabel(visitor.region) : '—'],
                  ['Region Code', visitor.region || '—'],
                  ['City', visitor.city || '—'],
                  ['Latitude', hasCoords ? visitor.lat.toFixed(6) : '—'],
                  ['Longitude', hasCoords ? visitor.lon.toFixed(6) : '—'],
                  ['Precision', hasCoords
                    ? (visitor.geoSource === 'gps'
                        ? (visitor.accuracy ? `±${Math.round(visitor.accuracy)} m` : 'GPS')
                        : 'IP-based')
                    : '—'],
                  ['IP Address', visitor.ip || '—'],
                  ['Source', visitor.geoSource || '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium">{k}</p>
                    <p className="text-ink mt-1 break-words">{v}</p>
                  </div>
                ))}
                {hasCoords && (
                  <div className="col-span-2">
                    <a href={`https://www.google.com/maps?q=${visitor.lat},${visitor.lon}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm">
                      <i className="fa-solid fa-map-location-dot"></i>
                      Open in Google Maps →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <CardHeader title="Overview" />
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
              {[
                ['First Visit', fmtDateTime(visitor.first_seen)],
                ['Last Visit',  fmtDateTime(visitor.last_seen)],
                ['Total Sessions', data.sessions?.length ?? 0],
                ['Total Page Views', data.pageViews?.length ?? 0],
                ['Total Clicks', clicks.length],
                ['Role', visitor.role || 'user'],
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
                ['Device',   visitor.device || '—'],
                ['Browser',  visitor.browser || '—'],
                ['OS',       visitor.os || '—'],
                ['Screen',   visitor.screen_w ? `${visitor.screen_w} × ${visitor.screen_h}` : '—'],
                ['Viewport', visitor.viewport_w ? `${visitor.viewport_w} × ${visitor.viewport_h}` : '—'],
              ].map(([k, v]) => (
                <div key={k}>
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
                <ol className="relative p-5 ml-3 border-l border-line max-h-[500px] overflow-y-auto">
                  {data.activities.slice(0, 40).map((a) => (
                    <li key={a.id} className="mb-5 ml-5">
                      <span className="absolute -left-[7px] mt-1 w-3.5 h-3.5 rounded-full bg-brand-600 border-2 border-white" />
                      <p className="text-xs text-ink-subtle">{fmtDateTime(a.timestamp)}</p>
                      <p className="text-sm font-medium text-ink mt-0.5">
                        <Badge tone={a.type === 'click' ? 'info' : 'neutral'}>{a.type}</Badge>
                        <span className="ml-2">{a.text || a.element || a.path}</span>
                      </p>
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
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50/90 backdrop-blur">
                      <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line">
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
                        <td className="px-5 py-3 text-ink-muted truncate max-w-[240px]">{p.ref_host || '—'}</td>
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