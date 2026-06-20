// import { useState, useEffect } from 'react'
// import { Plus, Trash2, RefreshCw, Fuel as FuelIcon, Droplet, Wallet } from 'lucide-react'
// import { fuelAPI, vehicleAPI } from '../services/api'
// import { useToast } from '../context/ToastContext'
// import Modal from '../components/Modal'
// import { LoadingState, EmptyState, PageHeader } from '../components/Common'

// const EMPTY = { vehicle_id: '', driver_id: '', litres: '', cost_per_litre: '', odometer_km: '', fuel_type: 'diesel', station_name: '' }

// export default function Fuel() {
//   const [logs, setLogs] = useState([])
//   const [vehicles, setVehicles] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modal, setModal] = useState(false)
//   const [form, setForm] = useState(EMPTY)
//   const [saving, setSaving] = useState(false)
//   const [filter, setFilter] = useState('')
//   const toast = useToast()

//   const load = () => {
//     setLoading(true)
//     Promise.all([fuelAPI.getAll(filter ? { vehicle_id: filter } : {}), vehicleAPI.getAll()])
//       .then(([f, v]) => { setLogs(f.data.data); setVehicles(v.data.data) })
//       .catch(() => toast.error('Failed to load'))
//       .finally(() => setLoading(false))
//   }
//   useEffect(() => { load() }, [filter])

//   const handleSave = async () => {
//     setSaving(true)
//     try { await fuelAPI.create(form); toast.success('Fuel log added'); setModal(false); load() }
//     catch (err) { toast.error(err.response?.data?.message || 'Failed') }
//     finally { setSaving(false) }
//   }

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this fuel log?')) return
//     try { await fuelAPI.remove(id); toast.success('Deleted'); load() }
//     catch { toast.error('Delete failed') }
//   }

//   const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

//   const totalLitres = logs.reduce((s, l) => s + (l.litres || 0), 0)
//   const totalCost = logs.reduce((s, l) => s + parseFloat(l.total_cost || 0), 0)

//   return (
//     <div className="page-enter">
//       <PageHeader title="Fuel" accent="Logs" sub={`${logs.length} records`}>
//         <button className="btn-icon" onClick={load} title="Refresh"><RefreshCw size={14} /></button>
//         <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal(true) }}><Plus size={15} /> Log Fuel</button>
//       </PageHeader>

//       <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
//         <div className="stat-card blue">
//           <div className="stat-icon blue"><FuelIcon size={18} /></div>
//           <div className="stat-label">Total Records</div>
//           <div className="stat-value">{logs.length}</div>
//         </div>
//         <div className="stat-card blue">
//           <div className="stat-icon blue"><Droplet size={18} /></div>
//           <div className="stat-label">Total Litres</div>
//           <div className="stat-value">{totalLitres.toFixed(1)}<span style={{ fontSize: '1rem' }}> L</span></div>
//         </div>
//         <div className="stat-card green">
//           <div className="stat-icon green"><Wallet size={18} /></div>
//           <div className="stat-label">Total Cost</div>
//           <div className="stat-value">₹{totalCost.toFixed(0)}</div>
//         </div>
//       </div>

//       <div className="filter-bar">
//         <select className="input" value={filter} onChange={e => setFilter(e.target.value)}>
//           <option value="">All vehicles</option>
//           {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no}</option>)}
//         </select>
//       </div>

//       <div className="table-container">
//         <div className="table-scroll">
//           <table>
//             <thead>
//               <tr><th>Date</th><th>Vehicle</th><th>Fuel Type</th><th>Litres</th><th>Cost/L</th><th>Total</th><th>Odometer</th><th>Station</th><th></th></tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan={9}><LoadingState label="Loading fuel logs…" /></td></tr>
//               ) : logs.length === 0 ? (
//                 <tr><td colSpan={9}><EmptyState icon="⛽" title="No fuel logs found" sub="Log a fill-up to see it here" /></td></tr>
//               ) : logs.map(l => (
//                 <tr key={l.id}>
//                   <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(l.filled_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</span></td>
//                   <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand)', fontSize: '0.82rem', fontWeight: 600 }}>#{l.vehicle_id}</span></td>
//                   <td><span className="badge badge-blue">{l.fuel_type}</span></td>
//                   <td><span style={{ fontFamily: 'var(--font-mono)' }}>{l.litres} L</span></td>
//                   <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>₹{l.cost_per_litre || '—'}</span></td>
//                   <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontWeight: 700 }}>₹{parseFloat(l.total_cost || 0).toFixed(2)}</span></td>
//                   <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{l.odometer_km ? `${l.odometer_km.toLocaleString()} km` : '—'}</span></td>
//                   <td>{l.station_name || '—'}</td>
//                   <td><button className="btn-icon" onClick={() => handleDelete(l.id)} style={{ color: 'var(--red)' }}><Trash2 size={13} /></button></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {modal && (
//         <Modal
//           title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FuelIcon size={16} /> Log Fuel</span>}
//           onClose={() => setModal(false)}
//           footer={<>
//             <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
//             <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Log'}</button>
//           </>}
//         >
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
//             <div className="form-group"><label className="form-label">Vehicle *</label>
//               <select className="input" value={form.vehicle_id} onChange={f('vehicle_id')}>
//                 <option value="">Select vehicle</option>
//                 {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no} — {v.make} {v.model}</option>)}
//               </select>
//             </div>
//             <div className="form-grid-2">
//               <div className="form-group"><label className="form-label">Litres *</label><input className="input" type="number" step="0.1" value={form.litres} onChange={f('litres')} /></div>
//               <div className="form-group"><label className="form-label">Cost Per Litre (₹)</label><input className="input" type="number" step="0.01" value={form.cost_per_litre} onChange={f('cost_per_litre')} /></div>
//               <div className="form-group"><label className="form-label">Fuel Type</label>
//                 <select className="input" value={form.fuel_type} onChange={f('fuel_type')}>
//                   {['petrol','diesel','electric','hybrid'].map(t => <option key={t}>{t}</option>)}
//                 </select>
//               </div>
//               <div className="form-group"><label className="form-label">Odometer (km)</label><input className="input" type="number" value={form.odometer_km} onChange={f('odometer_km')} /></div>
//             </div>
//             <div className="form-group"><label className="form-label">Station Name</label><input className="input" value={form.station_name} onChange={f('station_name')} placeholder="HP / Indian Oil…" /></div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   )
// }

import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, RefreshCw, Fuel as FuelIcon, Droplet, Wallet } from 'lucide-react'
import { fuelAPI, vehicleAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'
import { LoadingState, EmptyState, PageHeader } from '../components/Common'

const EMPTY = {
  vehicle_id: '', driver_id: '', litres: '', cost_per_litre: '',
  odometer_km: '', fuel_type: 'diesel', station_name: '',
}

const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid']

const FUEL_TYPE_COLORS = {
  petrol:   { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  diesel:   { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  electric: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  hybrid:   { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
}

function FuelTypeBadge({ type }) {
  const s = FUEL_TYPE_COLORS[type] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' }
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: '2px 10px', borderRadius: '999px', fontSize: '0.72rem',
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em'
    }}>{type}</span>
  )
}

function StatCard({ icon: Icon, label, value, color = 'blue', sub }) {
  const colors = {
    blue:  { bg: '#eff6ff', icon: '#3b82f6', border: '#bfdbfe' },
    green: { bg: '#f0fdf4', icon: '#22c55e', border: '#bbf7d0' },
  }
  const c = colors[color]
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${c.icon}` }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: c.bg,
        border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: 12, color: c.icon,
      }}>
        <Icon size={18} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function CostPreview({ litres, costPerLitre }) {
  const l = parseFloat(litres), c = parseFloat(costPerLitre)
  if (!l || !c || isNaN(l) || isNaN(c)) return null
  return (
    <div style={{
      background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
      padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Estimated Total</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#16a34a', fontSize: '1rem' }}>
        ₹{(l * c).toFixed(2)}
      </span>
    </div>
  )
}

function validate(form) {
  const e = {}
  if (!form.vehicle_id) e.vehicle_id = 'Select a vehicle'
  if (!form.litres || parseFloat(form.litres) <= 0) e.litres = 'Enter litres > 0'
  if (!form.cost_per_litre || parseFloat(form.cost_per_litre) <= 0) e.cost_per_litre = 'Enter cost > 0'
  return e
}

export default function Fuel() {
  const [logs, setLogs]         = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [filter, setFilter]     = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const toast = useToast()

  const load = () => {
    setLoading(true)
    const params = {}
    if (filter)   params.vehicle_id = filter
    if (dateFrom) params.from = dateFrom
    if (dateTo)   params.to   = dateTo
    Promise.all([fuelAPI.getAll(params), vehicleAPI.getAll()])
      .then(([f, v]) => { setLogs(f.data.data || []); setVehicles(v.data.data || []) })
      .catch(() => toast.error('Failed to load fuel data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter, dateFrom, dateTo])

  const vehicleMap = useMemo(() => {
    const m = {}; vehicles.forEach(v => { m[v.id] = v }); return m
  }, [vehicles])

  const filteredLogs = useMemo(() =>
    typeFilter ? logs.filter(l => l.fuel_type === typeFilter) : logs,
    [logs, typeFilter]
  )

  const totalLitres = filteredLogs.reduce((s, l) => s + (parseFloat(l.litres) || 0), 0)
  const totalCost   = filteredLogs.reduce((s, l) => s + parseFloat(l.total_cost || 0), 0)
  const avgCostPerL = totalLitres > 0 ? (totalCost / totalLitres) : 0

  const handleSave = async () => {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      await fuelAPI.create(form)
      toast.success('Fuel log added')
      setModal(false); setForm(EMPTY); setErrors({}); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this fuel log?')) return
    try { await fuelAPI.remove(id); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const openModal = () => { setForm(EMPTY); setErrors({}); setModal(true) }
  const f = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n })
  }

  const clearFilters = () => { setFilter(''); setTypeFilter(''); setDateFrom(''); setDateTo('') }
  const hasFilters = filter || typeFilter || dateFrom || dateTo

  return (
    <div className="page-enter">
      <PageHeader title="Fuel" accent="Logs" sub={`${filteredLogs.length} records`}>
        <button className="btn-icon" onClick={load} title="Refresh"><RefreshCw size={14} /></button>
        <button className="btn btn-primary" onClick={openModal}><Plus size={15} /> Log Fuel</button>
      </PageHeader>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <StatCard icon={FuelIcon} label="Total Records" value={filteredLogs.length} color="blue" />
        <StatCard icon={Droplet} label="Total Litres"
          value={<>{totalLitres.toFixed(1)}<span style={{ fontSize: '1rem' }}> L</span></>} color="blue" />
        <StatCard icon={Wallet} label="Total Cost"
          value={`₹${totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          color="green" sub={avgCostPerL > 0 ? `Avg ₹${avgCostPerL.toFixed(2)}/L` : undefined} />
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
        padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end',
      }}>
        {[
          { label: 'Vehicle', el: <select className="input" value={filter} onChange={e => setFilter(e.target.value)} style={{ minWidth: 160 }}>
              <option value="">All vehicles</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no}</option>)}
            </select> },
          { label: 'Fuel Type', el: <select className="input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ minWidth: 120 }}>
              <option value="">All types</option>
              {FUEL_TYPES.map(t => <option key={t}>{t}</option>)}
            </select> },
          { label: 'From', el: <input className="input" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ minWidth: 130 }} /> },
          { label: 'To',   el: <input className="input" type="date" value={dateTo}   onChange={e => setDateTo(e.target.value)}   style={{ minWidth: 130 }} /> },
        ].map(({ label, el }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
            {el}
          </div>
        ))}
        {hasFilters && <button className="btn btn-secondary" onClick={clearFilters} style={{ alignSelf: 'flex-end' }}>Clear filters</button>}
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Date</th><th>Vehicle</th><th>Fuel Type</th><th>Litres</th><th>Cost/L</th><th>Total</th><th>Odometer</th><th>Station</th><th></th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9}><LoadingState label="Loading fuel logs…" /></td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={9}>
                  <EmptyState icon="⛽" title="No fuel logs found"
                    sub={hasFilters ? 'Try adjusting filters' : 'Log a fill-up to see it here'} />
                </td></tr>
              ) : filteredLogs.map(l => {
                const veh = vehicleMap[l.vehicle_id]
                return (
                  <tr key={l.id}>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(l.filled_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </span></td>
                    <td>
                      {veh ? (
                        <div>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand)', fontSize: '0.82rem', fontWeight: 700 }}>{veh.registration_no}</span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{veh.make} {veh.model}</div>
                        </div>
                      ) : <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>#{l.vehicle_id}</span>}
                    </td>
                    <td><FuelTypeBadge type={l.fuel_type} /></td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{parseFloat(l.litres).toFixed(1)} L</span></td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{l.cost_per_litre ? `₹${parseFloat(l.cost_per_litre).toFixed(2)}` : '—'}</span></td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', color: '#16a34a', fontWeight: 700 }}>₹{parseFloat(l.total_cost || 0).toFixed(2)}</span></td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{l.odometer_km ? `${parseFloat(l.odometer_km).toLocaleString('en-IN')} km` : '—'}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{l.station_name || '—'}</td>
                    <td><button className="btn-icon" onClick={() => handleDelete(l.id)} title="Delete" style={{ color: '#dc2626' }}><Trash2 size={13} /></button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FuelIcon size={16} /> Log Fuel Fill-up</span>}
          onClose={() => setModal(false)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Log'}</button>
          </>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Vehicle *</label>
              <select className="input" value={form.vehicle_id} onChange={f('vehicle_id')}
                style={errors.vehicle_id ? { borderColor: '#dc2626' } : {}}>
                <option value="">Select vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no} — {v.make} {v.model}</option>)}
              </select>
              {errors.vehicle_id && <span style={{ color: '#dc2626', fontSize: '0.75rem' }}>{errors.vehicle_id}</span>}
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Litres *</label>
                <input className="input" type="number" step="0.1" min="0" placeholder="e.g. 40.5"
                  value={form.litres} onChange={f('litres')} style={errors.litres ? { borderColor: '#dc2626' } : {}} />
                {errors.litres && <span style={{ color: '#dc2626', fontSize: '0.75rem' }}>{errors.litres}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Cost Per Litre (₹) *</label>
                <input className="input" type="number" step="0.01" min="0" placeholder="e.g. 96.50"
                  value={form.cost_per_litre} onChange={f('cost_per_litre')} style={errors.cost_per_litre ? { borderColor: '#dc2626' } : {}} />
                {errors.cost_per_litre && <span style={{ color: '#dc2626', fontSize: '0.75rem' }}>{errors.cost_per_litre}</span>}
              </div>
            </div>
            <CostPreview litres={form.litres} costPerLitre={form.cost_per_litre} />
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Fuel Type</label>
                <select className="input" value={form.fuel_type} onChange={f('fuel_type')}>
                  {FUEL_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Odometer (km)</label>
                <input className="input" type="number" min="0" placeholder="e.g. 54200"
                  value={form.odometer_km} onChange={f('odometer_km')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Station Name</label>
              <input className="input" value={form.station_name} onChange={f('station_name')} placeholder="HP / Indian Oil / BPCL…" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
