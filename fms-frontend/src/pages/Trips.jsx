// import { useState, useEffect } from 'react'
// import { Plus, Play, Square, X, RefreshCw, MapPin, Clock, Truck, Ban, Pencil, Calendar } from 'lucide-react'
// import { tripAPI, vehicleAPI, driverAPI } from '../services/api'
// import { useToast } from '../context/ToastContext'

// const STATUS_BADGE = {
//   planned:     'badge-amber',
//   in_progress: 'badge-blue',
//   completed:   'badge-green',
//   cancelled:   'badge-red',
// }

// const EMPTY_FORM = {
//   vehicle_id: '', driver_id: '', start_location: '', end_location: '',
//   start_odometer: '', purpose: '', notes: '',
//   trip_date: new Date().toISOString().split('T')[0],
//   start_time: '', expected_end_time: '',
// }

// export default function Trips() {
//   const [trips,    setTrips]    = useState([])
//   const [vehicles, setVehicles] = useState([])
//   const [drivers,  setDrivers]  = useState([])
//   const [loading,  setLoading]  = useState(true)
//   const [modal,    setModal]    = useState(null)
//   const [selected, setSelected] = useState(null)
//   const [form,     setForm]     = useState(EMPTY_FORM)
//   const [endForm,  setEndForm]  = useState({ end_odometer: '', fuel_used: '', end_location: '' })
//   const [saving,   setSaving]   = useState(false)
//   const [autoDriver, setAutoDriver] = useState(null)
//   const toast = useToast()

//   const load = () => {
//     setLoading(true)
//     Promise.all([
//       tripAPI.getAll(),
//       vehicleAPI.getAll({ status: 'active' }),
//       driverAPI.getAll(),
//     ])
//       .then(([t, v, d]) => {
//         setTrips(t.data.data || [])
//         setVehicles(v.data.data || [])
//         setDrivers(d.data.data || [])
//       })
//       .catch(() => toast.error('Failed to load'))
//       .finally(() => setLoading(false))
//   }
//   useEffect(() => { load() }, [])

//   /* vehicle pick → auto-fill driver + odometer (read-only) */
//   const handleVehicleChange = (e) => {
//     const vid = e.target.value
//     const vehicle  = vehicles.find(v => String(v.id) === String(vid))
//     const assigned = drivers.find(d =>
//       String(d.assigned_vehicle_id) === String(vid) && d.status === 'available'
//     )
//     setAutoDriver(assigned || null)
//     setForm(p => ({
//       ...p,
//       vehicle_id:     vid,
//       driver_id:      assigned ? String(assigned.id) : '',
//       start_odometer: vehicle?.odometer_km ? String(vehicle.odometer_km) : '',
//     }))
//   }

//   const f  = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
//   const ef = k => e => setEndForm(p => ({ ...p, [k]: e.target.value }))
//   const getDriver = id => drivers.find(d => String(d.id) === String(id))

//   const handleSchedule = async () => {
//     if (!form.vehicle_id) { toast.error('Select a vehicle'); return }
//     if (!form.driver_id)  { toast.error('Select a driver');  return }
//     setSaving(true)
//     try {
//       await tripAPI.create(form)
//       toast.success('Trip scheduled — driver has been notified ✓')
//       setModal(null); load()
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed to schedule') }
//     finally { setSaving(false) }
//   }

//   const handleUpdate = async () => {
//     setSaving(true)
//     try {
//       await tripAPI.update(selected.id, form)
//       toast.success('Trip updated')
//       setModal(null); load()
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
//     finally { setSaving(false) }
//   }

//   const handleStart = async () => {
//     setSaving(true)
//     try {
//       await tripAPI.startTrip(selected.id, { start_odometer: selected.start_odometer })
//       toast.success('Trip started — status is now IN PROGRESS')
//       setModal(null); load()
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed to start') }
//     finally { setSaving(false) }
//   }

//   const handleEnd = async () => {
//     if (!endForm.end_odometer) { toast.error('Enter end odometer'); return }
//     setSaving(true)
//     try {
//       await tripAPI.endTrip(selected.id, endForm)
//       toast.success('Trip completed ✓')
//       setModal(null); load()
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed to end') }
//     finally { setSaving(false) }
//   }

//   const handleCancel = async () => {
//     setSaving(true)
//     try {
//       await tripAPI.cancelTrip(selected.id)
//       toast.success('Trip cancelled')
//       setModal(null); load()
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed to cancel') }
//     finally { setSaving(false) }
//   }

//   const openSchedule = () => {
//     setForm({ ...EMPTY_FORM, trip_date: new Date().toISOString().split('T')[0] })
//     setAutoDriver(null); setModal('schedule')
//   }

//   const availableDrivers = drivers.filter(d => d.status === 'available')
//   const onTripCount      = drivers.filter(d => d.status === 'on_trip').length

//   return (
//     <div className="page-enter">

//       {/* Header */}
//       <div className="page-header">
//         <div>
//           <h1 className="page-title">Trip <span className="accent">Management</span></h1>
//           <p className="page-sub">{trips.length} total trips · {onTripCount} currently on road</p>
//         </div>
//         <div style={{ display: 'flex', gap: 10 }}>
//           <button className="btn-icon" onClick={load}><RefreshCw size={14} /></button>
//           <button className="btn btn-primary" onClick={openSchedule}>
//             <Plus size={14} /> Schedule Trip
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="table-container">
//         <div className="table-scroll">
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th><th>Vehicle</th><th>Driver</th>
//                 <th>From</th><th>To</th><th>Date</th>
//                 <th>Distance</th><th>Status</th><th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Loading...</td></tr>
//               ) : trips.length === 0 ? (
//                 <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>No trips yet. Schedule one!</td></tr>
//               ) : trips.map(t => {
//                 const driver = getDriver(t.driver_id)
//                 return (
//                   <tr key={t.id}>
//                     <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontSize: '0.8rem' }}>#{t.id}</span></td>
//                     <td>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//                         <Truck size={12} color="#6b7280" />
//                         <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{t.vehicle?.registration_no || '—'}</span>
//                       </div>
//                     </td>
//                     <td><span style={{ fontSize: '0.84rem' }}>{driver?.user?.name || `#${t.driver_id}`}</span></td>
//                     <td style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//                         <MapPin size={11} color="#9ca3af" />{t.start_location || '—'}
//                       </div>
//                     </td>
//                     <td style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//                         <MapPin size={11} color="#2563eb" />{t.end_location || '—'}
//                       </div>
//                     </td>
//                     <td>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//                         <Clock size={11} color="#9ca3af" />
//                         <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#6b7280' }}>
//                           {t.trip_date || (t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : '—')}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
//                         {t.distance_km ? `${parseFloat(t.distance_km).toFixed(1)} km` : '—'}
//                       </span>
//                     </td>
//                     <td>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                         {t.status === 'in_progress' && (
//                           <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563eb', display: 'inline-block', animation: 'pulse 2s infinite' }} />
//                         )}
//                         <span className={`badge ${STATUS_BADGE[t.status] || 'badge-slate'}`}>
//                           {t.status?.replace('_', ' ')}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <div style={{ display: 'flex', gap: 5 }}>
//                         {t.status === 'planned' && (
//                           <button className="btn-icon" title="Edit" onClick={() => {
//                             setSelected(t)
//                             setForm({
//                               vehicle_id: t.vehicle_id, driver_id: t.driver_id,
//                               start_location: t.start_location || '', end_location: t.end_location || '',
//                               start_odometer: t.start_odometer || '', purpose: t.purpose || '', notes: t.notes || '',
//                               trip_date: t.trip_date || '', start_time: t.start_time || '',
//                               expected_end_time: t.expected_end_time || '',
//                             })
//                             setModal('edit')
//                           }}><Pencil size={13} /></button>
//                         )}
//                         {t.status === 'planned' && (
//                           <button className="btn-icon" title="Start trip" style={{ color: '#16a34a' }} onClick={() => {
//                             setSelected(t); setModal('start')
//                           }}><Play size={13} /></button>
//                         )}
//                         {t.status === 'in_progress' && (
//                           <button className="btn-icon" title="End trip" style={{ color: '#2563eb' }} onClick={() => {
//                             setSelected(t)
//                             setEndForm({ end_odometer: '', fuel_used: '', end_location: t.end_location || '' })
//                             setModal('end')
//                           }}><Square size={13} /></button>
//                         )}
//                         {(t.status === 'planned' || t.status === 'in_progress') && (
//                           <button className="btn-icon" title="Cancel" style={{ color: '#dc2626' }} onClick={() => {
//                             setSelected(t); setModal('cancel')
//                           }}><Ban size={13} /></button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── MODAL: Schedule ── */}
//       {modal === 'schedule' && (
//         <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null) }}>
//           <div className="modal modal-wide">
//             <div className="modal-header">
//               <h2 className="modal-title"><Calendar size={15} /> Schedule New Trip</h2>
//               <button className="btn-icon" onClick={() => setModal(null)}><X size={14} /></button>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

//               {/* Vehicle — active only */}
//               <div className="form-group">
//                 <label className="form-label">Vehicle *</label>
//                 <select className="input" value={form.vehicle_id} onChange={handleVehicleChange}>
//                   <option value="">Choose a vehicle...</option>
//                   {vehicles.map(v => {
//                     const hasDriver = drivers.find(d => String(d.assigned_vehicle_id) === String(v.id) && d.status === 'available')
//                     return (
//                       <option key={v.id} value={v.id}>
//                         {v.registration_no} — {v.make} {v.model}
//                         {hasDriver ? ` ✓ (${hasDriver.user?.name || 'driver ready'})` : ''}
//                       </option>
//                     )
//                   })}
//                 </select>
//               </div>

//               {/* Driver — available only */}
//               <div className="form-group">
//                 <label className="form-label">Driver *</label>
//                 {autoDriver ? (
//                   <div style={{ padding: '12px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
//                     <div style={{ width: 32, height: 32, background: '#16a34a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                       <span style={{ color: '#fff', fontSize: 14 }}>✓</span>
//                     </div>
//                     <div>
//                       <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#15803d' }}>{autoDriver.user?.name || `Driver #${autoDriver.id}`}</div>
//                       <div style={{ fontSize: '0.75rem', color: '#166534' }}>Auto-assigned · License: {autoDriver.license_number}</div>
//                     </div>
//                     <button style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
//                       onClick={() => { setAutoDriver(null); setForm(p => ({ ...p, driver_id: '' })) }}>
//                       Change
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <select className="input" value={form.driver_id} onChange={f('driver_id')}>
//                       <option value="">Select available driver...</option>
//                       {availableDrivers.map(d => (
//                         <option key={d.id} value={d.id}>{d.user?.name || `Driver #${d.id}`} — {d.license_number}</option>
//                       ))}
//                     </select>
//                     {availableDrivers.length === 0 && (
//                       <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 4 }}>⚠ No available drivers right now.</p>
//                     )}
//                     {onTripCount > 0 && (
//                       <p style={{ fontSize: '0.73rem', color: '#9ca3af', marginTop: 4 }}>{onTripCount} driver(s) on trip are hidden.</p>
//                     )}
//                   </>
//                 )}
//               </div>

//               {/* Trip Date + Start Time */}
//               <div className="form-grid-2">
//                 <div className="form-group">
//                   <label className="form-label">Trip Date</label>
//                   <input className="input" type="date" value={form.trip_date} onChange={f('trip_date')} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Start Time</label>
//                   <input className="input" type="time" value={form.start_time} onChange={f('start_time')} />
//                 </div>
//               </div>

//               {/* From + To */}
//               <div className="form-grid-2">
//                 <div className="form-group">
//                   <label className="form-label">From (Start Location)</label>
//                   <input className="input" value={form.start_location} onChange={f('start_location')} placeholder="e.g. Bengaluru Warehouse" />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">To (Destination)</label>
//                   <input className="input" value={form.end_location} onChange={f('end_location')} placeholder="e.g. Mysuru Depot" />
//                 </div>
//               </div>

//               {/* Start Odometer (read-only) + Expected End Time */}
//               <div className="form-grid-2">
//                 <div className="form-group">
//                   <label className="form-label">
//                     Start Odometer (km)
                   
//                   </label>
//                   <input className="input" type="number" value={form.start_odometer} readOnly
//                     style={{ background: 'var(--bg-canvas)', cursor: 'not-allowed', color: '#6b7280' }}
//                     placeholder="Select a vehicle first" />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Expected End Time <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>(Optional)</span></label>
//                   <input className="input" type="time" value={form.expected_end_time} onChange={f('expected_end_time')} />
//                 </div>
//               </div>

//               {/* Purpose + Notes */}
//               <div className="form-grid-2">
//                 <div className="form-group">
//                   <label className="form-label">Purpose</label>
//                   <select className="input" value={form.purpose} onChange={f('purpose')}>
//                     <option value="">Select purpose...</option>
//                     {['Delivery', 'Pickup', 'Transport', 'Maintenance Run', 'Client Visit', 'Other'].map(p => (
//                       <option key={p} value={p}>{p}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Notes <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>(Optional)</span></label>
//                   <input className="input" value={form.notes} onChange={f('notes')} placeholder="Any additional info..." />
//                 </div>
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
//               <button className="btn btn-primary" onClick={handleSchedule} disabled={saving}>
//                 <Plus size={13} />{saving ? 'Scheduling...' : 'Schedule Trip'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── MODAL: Edit ── */}
//       {modal === 'edit' && selected && (
//         <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null) }}>
//           <div className="modal modal-wide">
//             <div className="modal-header">
//               <h2 className="modal-title"><Pencil size={15} /> Edit Trip #{selected.id}</h2>
//               <button className="btn-icon" onClick={() => setModal(null)}><X size={14} /></button>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//               <div className="form-grid-2">
//                 <div className="form-group">
//                   <label className="form-label">Trip Date</label>
//                   <input className="input" type="date" value={form.trip_date} onChange={f('trip_date')} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Start Time</label>
//                   <input className="input" type="time" value={form.start_time} onChange={f('start_time')} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">From</label>
//                   <input className="input" value={form.start_location} onChange={f('start_location')} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">To</label>
//                   <input className="input" value={form.end_location} onChange={f('end_location')} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Purpose</label>
//                   <select className="input" value={form.purpose} onChange={f('purpose')}>
//                     <option value="">Select purpose...</option>
//                     {['Delivery', 'Pickup', 'Transport', 'Maintenance Run', 'Client Visit', 'Other'].map(p => (
//                       <option key={p} value={p}>{p}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Expected End Time</label>
//                   <input className="input" type="time" value={form.expected_end_time} onChange={f('expected_end_time')} />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Notes</label>
//                 <textarea className="input" value={form.notes} onChange={f('notes')} rows={2} />
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
//               <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
//                 {saving ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── MODAL: Start ── */}
//       {modal === 'start' && selected && (
//         <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null) }}>
//           <div className="modal">
//             <div className="modal-header">
//               <h2 className="modal-title"><Play size={14} /> Start Trip #{selected.id}</h2>
//               <button className="btn-icon" onClick={() => setModal(null)}><X size={14} /></button>
//             </div>
//             <div style={{ padding: '14px', background: 'var(--bg-canvas)', borderRadius: 8, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: '0.83rem' }}>
//               <div>
//                 <div style={{ color: '#9ca3af', fontSize: '0.73rem', marginBottom: 2 }}>VEHICLE</div>
//                 <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontWeight: 700 }}>{selected.vehicle?.registration_no || `#${selected.vehicle_id}`}</div>
//               </div>
//               <div>
//                 <div style={{ color: '#9ca3af', fontSize: '0.73rem', marginBottom: 2 }}>DRIVER</div>
//                 <div style={{ fontWeight: 600 }}>{getDriver(selected.driver_id)?.user?.name || `#${selected.driver_id}`}</div>
//               </div>
//               <div>
//                 <div style={{ color: '#9ca3af', fontSize: '0.73rem', marginBottom: 2 }}>ROUTE</div>
//                 <div>{selected.start_location || '—'} → {selected.end_location || '—'}</div>
//               </div>
//               <div>
//                 <div style={{ color: '#9ca3af', fontSize: '0.73rem', marginBottom: 2 }}>START ODOMETER</div>
//                 <div style={{ fontFamily: 'var(--font-mono)' }}>{selected.start_odometer || '—'} km</div>
//               </div>
//             </div>
//             <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, fontSize: '0.78rem', color: '#15803d', marginBottom: 16 }}>
//               ✓ Clicking "Start Trip" will set status to <strong>IN PROGRESS</strong> and mark the driver as <strong>ON TRIP</strong>.
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
//               <button className="btn btn-primary" onClick={handleStart} disabled={saving}
//                 style={{ background: '#16a34a', borderColor: '#16a34a' }}>
//                 <Play size={13} />{saving ? 'Starting...' : 'Start Trip'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── MODAL: End ── */}
//       {modal === 'end' && selected && (
//         <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null) }}>
//           <div className="modal">
//             <div className="modal-header">
//               <h2 className="modal-title"><Square size={14} /> End Trip #{selected.id}</h2>
//               <button className="btn-icon" onClick={() => setModal(null)}><X size={14} /></button>
//             </div>
//             <div style={{ padding: '14px', background: 'var(--bg-canvas)', borderRadius: 8, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: '0.83rem' }}>
//               <div>
//                 <div style={{ color: '#9ca3af', fontSize: '0.73rem', marginBottom: 2 }}>VEHICLE</div>
//                 <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontWeight: 700 }}>{selected.vehicle?.registration_no}</div>
//               </div>
//               <div>
//                 <div style={{ color: '#9ca3af', fontSize: '0.73rem', marginBottom: 2 }}>DRIVER</div>
//                 <div style={{ fontWeight: 600 }}>{getDriver(selected.driver_id)?.user?.name || `#${selected.driver_id}`}</div>
//               </div>
//               <div>
//                 <div style={{ color: '#9ca3af', fontSize: '0.73rem', marginBottom: 2 }}>START ODO</div>
//                 <div style={{ fontFamily: 'var(--font-mono)' }}>{selected.start_odometer} km</div>
//               </div>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//               <div className="form-group">
//                 <label className="form-label">End Location</label>
//                 <input className="input" value={endForm.end_location} onChange={ef('end_location')} />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">End Odometer (km) *</label>
//                 <input className="input" type="number" value={endForm.end_odometer} onChange={ef('end_odometer')} />
//                 {endForm.end_odometer && selected.start_odometer && (
//                   <p style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
//                     Distance: {(parseFloat(endForm.end_odometer) - parseFloat(selected.start_odometer)).toFixed(1)} km
//                   </p>
//                 )}
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Fuel Used (litres)</label>
//                 <input className="input" type="number" value={endForm.fuel_used} onChange={ef('fuel_used')} />
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
//               <button className="btn btn-primary" onClick={handleEnd} disabled={saving}>
//                 <Square size={13} />{saving ? 'Completing...' : 'Complete Trip'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── MODAL: Cancel ── */}
//       {modal === 'cancel' && selected && (
//         <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null) }}>
//           <div className="modal" style={{ maxWidth: 420 }}>
//             <div className="modal-header">
//               <h2 className="modal-title" style={{ color: 'var(--red)' }}><Ban size={15} /> Cancel Trip #{selected.id}</h2>
//               <button className="btn-icon" onClick={() => setModal(null)}><X size={14} /></button>
//             </div>
//             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
//               Are you sure you want to cancel this trip?
//             </p>
//             <div style={{ padding: '12px 14px', background: 'var(--bg-canvas)', borderRadius: 8, fontSize: '0.82rem', marginBottom: 12 }}>
//               <div><strong>{selected.start_location || '—'}</strong> → <strong>{selected.end_location || '—'}</strong></div>
//               <div style={{ color: '#6b7280', marginTop: 4 }}>Driver: {getDriver(selected.driver_id)?.user?.name || `#${selected.driver_id}`}</div>
//             </div>
//             {selected.status === 'in_progress' && (
//               <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, fontSize: '0.78rem', color: '#92400e', marginBottom: 12 }}>
//                 ⚠ This trip is IN PROGRESS. Driver will be marked available.
//               </div>
//             )}
//             <div className="modal-footer">
//               <button className="btn btn-secondary" onClick={() => setModal(null)}>Keep Trip</button>
//               <button className="btn btn-danger" onClick={handleCancel} disabled={saving}>
//                 {saving ? 'Cancelling...' : 'Yes, Cancel Trip'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// } 
import { useState, useEffect } from 'react'
import { RefreshCw, Play, Square } from 'lucide-react'
import { tripAPI, vehicleAPI, driverAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { LoadingState, EmptyState, PageHeader } from '../components/Common'

const STATUS_BADGE = { planned: 'badge-slate', in_progress: 'badge-blue', completed: 'badge-green', cancelled: 'badge-red' }

const EMPTY_FORM = { vehicle_id: '', driver_id: '', start_location: '', end_location: '', start_odometer: '', purpose: '', notes: '' }

export default function Trips() {
  const { user } = useAuth()
  const isDriver = user?.role === 'driver'
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
 const [endForm, setEndForm] = useState({
  end_odometer: '',
  fuel_used: '',
  end_location: '',
  end_time: '',
  fuel_filled: 'yes',
  fuel_quantity: '',
  fuel_cost: '',
  fuel_station: '',
  payment_mode: 'UPI',
  receipt: null
})
  const toast = useToast()

  const load = () => {
    setLoading(true)
    Promise.all([
      tripAPI.getAll(), // backend auto-scopes this to "my trips" for drivers
      vehicleAPI.getAll({ status: 'active' }),
      driverAPI.getAll(),
    ])
      .then(([t, v, d]) => {
        setTrips(t.data.data)
        setDrivers(d.data.data)
        if (isDriver && user?.driverId) {
          const own = d.data.data.find(dr => dr.id === user.driverId)
          setVehicles(own?.assignedVehicle ? v.data.data.filter(veh => veh.id === own.assigned_vehicle_id) : [])
        } else {
          setVehicles(v.data.data)
        }
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleStart = async () => {
    setSaving(true)
    try { await tripAPI.startTrip(form); toast.success('Trip started'); setModal(null); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleEnd = async () => {
    setSaving(true)
    try { await tripAPI.endTrip(selected.id, endForm); toast.success('Trip completed'); setModal(null); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const f = (k) => (e) => {
    const value = e.target.value
    setForm(p => {
      const next = { ...p, [k]: value }
      // Auto Trip Assignment: when a vehicle is picked, look up the driver
      // who has this vehicle as their assigned_vehicle_id and auto-fill it.
      if (k === 'vehicle_id') {
        const match = drivers.find(d => String(d.assigned_vehicle_id) === String(value))
        next.driver_id = match ? String(match.id) : ''
      }
      return next
    })
  }

  const autoAssignedDriver = drivers.find(d => String(d.assigned_vehicle_id) === String(form.vehicle_id))
  const ef = (k) => (e) => setEndForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="page-enter">
      <PageHeader title={isDriver ? 'My' : 'Trip'} accent={isDriver ? 'Trips' : 'Management'} sub={isDriver ? `${trips.length} trips on record` : `${trips.length} total trips`}>
        <button className="btn-icon" onClick={load} title="Refresh"><RefreshCw size={14} /></button>
        <button className="btn btn-primary" onClick={() => { setForm({ ...EMPTY_FORM, driver_id: isDriver ? String(user.driverId) : '' }); setModal('start') }}><Play size={14} /> Start Trip</button>
      </PageHeader>

      <div className="table-container">
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>ID</th><th>Vehicle</th>{!isDriver && <th>Driver</th>}<th>From</th><th>To</th><th>Start Time</th><th>End Time</th><th>Distance</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10}><LoadingState label="Loading trips…" /></td></tr>
              ) : trips.length === 0 ? (
                <tr><td colSpan={10}><EmptyState icon="🗺️" title="No trips found" sub="Start a trip to see it here" /></td></tr>
              ) : trips.map(t => (
                <tr key={t.id}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand)', fontSize: '0.8rem', fontWeight: 600 }}>#{t.id}</span></td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{t.vehicle?.registration_no || '—'}</span></td>
                  <td>
                    <span style={{ fontSize: '0.84rem' }}>{t.driver?.user?.name || `#${t.driver_id}`}</span>
                    {t.driver?.license_number && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t.driver.license_number}</div>}
                  </td>
                  <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.start_location || '—'}</td>
                  <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.end_location || '—'}</td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.start_time ? new Date(t.start_time).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</span></td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.end_time ? new Date(t.end_time).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</span></td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{t.distance_km ? `${t.distance_km.toFixed(1)} km` : '—'}</span></td>
                  <td><span className={`badge ${STATUS_BADGE[t.status] || 'badge-slate'}`}>{t.status?.replace('_', ' ')}</span></td>
                  <td>
                    {t.status === 'in_progress' && (
                      <button className="btn btn-sm btn-secondary" onClick={() => {
                        setSelected(t)
                        const now = new Date()
                        const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
                        setEndForm({ end_odometer: '', fuel_used: '', end_location: t.end_location || '', end_time: localNow })
                        setModal('end')
                      }}>
                        <Square size={11} /> End
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal === 'start' && (
        <Modal
          title="Start New Trip"
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleStart} disabled={saving}><Play size={13} />{saving ? 'Starting…' : 'Start Trip'}</button>
          </>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group"><label className="form-label">Vehicle *</label>
              <select className="input" value={form.vehicle_id} onChange={f('vehicle_id')}>
                <option value="">Select vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no} — {v.make} {v.model}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Driver *</label>
              {autoAssignedDriver ? (
                <div>
                  <div className="input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--brand-light)', borderColor: 'var(--brand)', cursor: 'default' }}>
                    <span>#{autoAssignedDriver.id} — {autoAssignedDriver.license_number} {autoAssignedDriver.user?.name ? `(${autoAssignedDriver.user.name})` : ''}</span>
                    <span className="badge badge-brand">AUTO-ASSIGNED</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                    Driver locked to this vehicle. To change, update the driver's assigned vehicle on the Drivers page.
                  </div>
                </div>
              ) : (
                <select className="input" value={form.driver_id} onChange={f('driver_id')}>
                  <option value="">Select driver</option>
                  {drivers.filter(d => d.status === 'available').map(d => <option key={d.id} value={d.id}>#{d.id} — {d.license_number}</option>)}
                </select>
              )}
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Start Location</label><input className="input" value={form.start_location} onChange={f('start_location')} placeholder="Origin" /></div>
              <div className="form-group"><label className="form-label">Destination</label><input className="input" value={form.end_location} onChange={f('end_location')} placeholder="Destination" /></div>
            </div>
            <div className="form-group"><label className="form-label">Start Odometer (km)</label><input className="input" type="number" value={form.start_odometer} onChange={f('start_odometer')} /></div>
            <div className="form-group"><label className="form-label">Purpose</label><input className="input" value={form.purpose} onChange={f('purpose')} placeholder="Delivery / Transport…" /></div>
            <div className="form-group"><label className="form-label">Notes</label><textarea className="input" value={form.notes} onChange={f('notes')} rows={2} /></div>
          </div>
        </Modal>
      )}

      {modal === 'end' && (
        <Modal
          title={`End Trip #${selected?.id}`}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEnd} disabled={saving}><Square size={13} />{saving ? 'Ending…' : 'End Trip'}</button>
          </>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group"><label className="form-label">End Location</label><input className="input" value={endForm.end_location} onChange={ef('end_location')} /></div>
            <div className="form-group"><label className="form-label">End Time</label><input className="input" type="datetime-local" value={endForm.end_time} onChange={ef('end_time')} /></div>
            <div className="form-group"><label className="form-label">End Odometer (km) *</label><input className="input" type="number" value={endForm.end_odometer} onChange={ef('end_odometer')} /></div>
            <div className="form-group"><label className="form-label">Fuel Used (litres)</label><input className="input" type="number" value={endForm.fuel_used} onChange={ef('fuel_used')} /></div>

            <h3>Fuel Details</h3>

<div className="form-group">
  <label className="form-label">Fuel Filled?</label>
  <select
    className="input"
    value={endForm.fuel_filled}
    onChange={(e) =>
      setEndForm(p => ({ ...p, fuel_filled: e.target.value }))
    }
  >
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

<div className="form-group">
  <label className="form-label">Fuel Quantity (L)</label>
  <input
    className="input"
    type="number"
    value={endForm.fuel_quantity}
    onChange={(e) =>
      setEndForm(p => ({ ...p, fuel_quantity: e.target.value }))
    }
  />
</div>

<div className="form-group">
  <label className="form-label">Fuel Cost (₹)</label>
  <input
    className="input"
    type="number"
    value={endForm.fuel_cost}
    onChange={(e) =>
      setEndForm(p => ({ ...p, fuel_cost: e.target.value }))
    }
  />
</div>

<div className="form-group">
  <label className="form-label">Fuel Station</label>
  <input
    className="input"
    type="text"
    value={endForm.fuel_station}
    onChange={(e) =>
      setEndForm(p => ({ ...p, fuel_station: e.target.value }))
    }
  />
</div>

<div className="form-group">
  <label className="form-label">Payment Mode</label>
  <select
    className="input"
    value={endForm.payment_mode}
    onChange={(e) =>
      setEndForm(p => ({ ...p, payment_mode: e.target.value }))
    }
  >
    <option>UPI</option>
    <option>Cash</option>
    <option>Card</option>
  </select>
</div>

<div className="form-group">
  <label className="form-label">Receipt Photo (Optional)</label>
  <input
    className="input"
    type="file"
    accept="image/*"
    onChange={(e) =>
      setEndForm(p => ({ ...p, receipt: e.target.files[0] }))
    }
  />
</div>
          </div>
        </Modal>
      )}
    </div>
  )
}
