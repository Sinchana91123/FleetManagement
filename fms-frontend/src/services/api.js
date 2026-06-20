// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api',
//   withCredentials: true,
//   headers: { 'Content-Type': 'application/json' },
// })

// // FIX: don't redirect on /auth/me — that's just the session check on page load
// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401 && err.config?.url !== '/auth/me') {
//       window.location.href = '/login'
//     }
//     return Promise.reject(err)
//   }
// )

// export const authAPI = {
//   register: (data) => api.post('/auth/register', data),
//   login:    (data) => api.post('/auth/login', data),
//   logout:   ()     => api.post('/auth/logout'),
//   me:              ()     => api.get('/auth/me'),
//   forgotPassword:  (data) => api.post('/auth/forgot-password', data),
//   resetPassword:   (data) => api.post('/auth/reset-password', data),
// }

// export const vehicleAPI = {
//   getAll:  (params) => api.get('/vehicles', { params }),
//   getById: (id)     => api.get(`/vehicles/${id}`),
//   create:  (data)   => api.post('/vehicles', data),
//   update:  (id, data) => api.put(`/vehicles/${id}`, data),
//   remove:  (id)     => api.delete(`/vehicles/${id}`),
// }

// export const driverAPI = {
//   getAll:  ()          => api.get('/drivers'),
//   getById: (id)        => api.get(`/drivers/${id}`),
//   create:  (data)      => api.post('/drivers', data),
//   update:  (id, data)  => api.put(`/drivers/${id}`, data),
//   remove:  (id)        => api.delete(`/drivers/${id}`),
// }

// export const gpsAPI = {
//   getLive:    ()              => api.get('/gps/live'),
//   getHistory: (id, params)   => api.get(`/gps/history/${id}`, { params }),
//   push:       (data)         => api.post('/gps/push', data),
// }

// export const fuelAPI = {
//   getAll: (params) => api.get('/fuel', { params }),
//   create: (data)   => api.post('/fuel', data),
//   remove: (id)     => api.delete(`/fuel/${id}`),
// }

// export const maintenanceAPI = {
//   getAll:     (params) => api.get('/maintenance', { params }),
//   getUpcoming: ()      => api.get('/maintenance/upcoming'),
//   create:     (data)   => api.post('/maintenance', data),
//   update:     (id, data) => api.put(`/maintenance/${id}`, data),
//   remove:     (id)     => api.delete(`/maintenance/${id}`),
// }

// export const documentAPI = {
//   getAll:     (params) => api.get('/documents', { params }),
//   getExpiring: ()      => api.get('/documents/expiring'),
//   upload:     (data)   => api.post('/documents', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   remove:     (id)     => api.delete(`/documents/${id}`),
// }

// export const tripAPI = {
//   getAll:     (params)   => api.get('/trips', { params }),
//   create:     (data)     => api.post('/trips', data),           // admin schedules (planned)
//   update:     (id, data) => api.put(`/trips/${id}`, data),      // admin edits planned trip
//   startTrip:  (id, data) => api.put(`/trips/${id}/start`, data),// start a planned trip
//   endTrip:    (id, data) => api.put(`/trips/${id}/end`, data),  // end an in-progress trip
//   cancelTrip: (id)       => api.put(`/trips/${id}/cancel`),     // admin cancels
// }

// export const alertAPI = {
//   getAll:      (params) => api.get('/alerts', { params }),
//   create:      (data)   => api.post('/alerts', data),
//   markRead:    (id)     => api.put(`/alerts/${id}/read`),
//   markAllRead: ()       => api.put('/alerts/read-all'),
//   checkExpiry: ()       => api.post('/alerts/check-expiry'),
// }

// export const reportAPI = {
//   summary: ()        => api.get('/reports/summary'),
//   fuel:    (params)  => api.get('/reports/fuel', { params }),
//   trips:   (params)  => api.get('/reports/trips', { params }),
// }

// export const userAPI = {
//   getAll:         ()          => api.get('/users'),
//   getById:        (id)        => api.get(`/users/${id}`),
//   create:         (data)      => api.post('/users', data),
//   update:         (id, data)  => api.put(`/users/${id}`, data),
//   toggleActive:   (id)        => api.put(`/users/${id}/toggle-active`),
//   resetPassword:  (id, data)  => api.put(`/users/${id}/reset-password`, data),
//   assignRole:     (id, data)  => api.put(`/users/${id}/role`, data),
//   remove:         (id)        => api.delete(`/users/${id}`),
// }

// export default api

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// FIX: don't redirect on /auth/me — that's just the session check on page load
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && err.config?.url !== '/auth/me') {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
  me:              ()     => api.get('/auth/me'),
  forgotPassword:  (data) => api.post('/auth/forgot-password', data),
  resetPassword:   (data) => api.post('/auth/reset-password', data),
}

export const vehicleAPI = {
  getAll:  (params) => api.get('/vehicles', { params }),
  getById: (id)     => api.get(`/vehicles/${id}`),
  create:  (data)   => api.post('/vehicles', data),
  update:  (id, data) => api.put(`/vehicles/${id}`, data),
  remove:  (id)     => api.delete(`/vehicles/${id}`),
}

export const fuelAPI = {
  getAll:  (params) => api.get('/fuel', { params }),
  create:  (data)   => api.post('/fuel', data),
  getById: (id)     => api.get(`/fuel/${id}`),
  getStats:(vehicleId) => api.get(`/fuel/stats/${vehicleId}`),
  remove:  (id)     => api.delete(`/fuel/${id}`),
}

export const driverAPI = {
  getAll: ()          => api.get('/drivers'),
  create: (data)      => api.post('/drivers', data),
  update: (id, data)  => api.put(`/drivers/${id}`, data),
  remove: (id)        => api.delete(`/drivers/${id}`),
}

export const gpsAPI = {
  getLive:    ()              => api.get('/gps/live'),
  getHistory: (id, params)   => api.get(`/gps/history/${id}`, { params }),
  push:       (data)         => api.post('/gps/push', data),
}

export const maintenanceAPI = {
  getAll:     (params) => api.get('/maintenance', { params }),
  getUpcoming: ()      => api.get('/maintenance/upcoming'),
  create:     (data)   => api.post('/maintenance', data),
  update:     (id, data) => api.put(`/maintenance/${id}`, data),
  remove:     (id)     => api.delete(`/maintenance/${id}`),
}

export const documentAPI = {
  getAll:     (params) => api.get('/documents', { params }),
  getExpiring: ()      => api.get('/documents/expiring'),
  upload:     (data)   => api.post('/documents', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:     (id)     => api.delete(`/documents/${id}`),
}

export const tripAPI = {
  getAll:   (params)   => api.get('/trips', { params }),
  startTrip: (data)    => api.post('/trips/start', data),
  endTrip:  (id, data) => api.put(`/trips/${id}/end`, data),
}

export const alertAPI = {
  getAll:      (params) => api.get('/alerts', { params }),
  create:      (data)   => api.post('/alerts', data),
  markRead:    (id)     => api.put(`/alerts/${id}/read`),
  markAllRead: ()       => api.put('/alerts/read-all'),
}

export const reportAPI = {
  summary: ()        => api.get('/reports/summary'),
  fuel:    (params)  => api.get('/reports/fuel', { params }),
  trips:   (params)  => api.get('/reports/trips', { params }),
}

export const userAPI = {
  getAll:         ()          => api.get('/users'),
  getById:        (id)        => api.get(`/users/${id}`),
  create:         (data)      => api.post('/users', data),
  update:         (id, data)  => api.put(`/users/${id}`, data),
  toggleActive:   (id)        => api.put(`/users/${id}/toggle-active`),
  resetPassword:  (id, data)  => api.put(`/users/${id}/reset-password`, data),
  assignRole:     (id, data)  => api.put(`/users/${id}/role`, data),
  remove:         (id)        => api.delete(`/users/${id}`),
}

export default api
