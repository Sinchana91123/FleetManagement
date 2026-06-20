// const { FuelLog, Driver } = require('../models');
// const { Op } = require('sequelize');

// exports.getAll = async (req, res) => {
//   try {
//     const { vehicle_id, from, to } = req.query;
//     const where = {};
//     if (from && to) where.filled_at = { [Op.between]: [new Date(from), new Date(to)] };

//     // If driver, scope to their assigned vehicle only
//     if (req.session.user?.role === 'driver') {
//       const driverRecord = await Driver.findOne({ where: { user_id: req.session.user.id } });
//       if (driverRecord?.assigned_vehicle_id) {
//         where.vehicle_id = driverRecord.assigned_vehicle_id;
//       } else {
//         return res.json({ success: true, data: [] });
//       }
//     } else {
//       if (vehicle_id) where.vehicle_id = vehicle_id;
//     }

//     const logs = await FuelLog.findAll({ where, order: [['filled_at','DESC']] });
//     return res.json({ success: true, data: logs });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.create = async (req, res) => {
//   try {
//     const { litres, cost_per_litre } = req.body;
//     const total_cost = (litres * cost_per_litre).toFixed(2);
//     const log = await FuelLog.create({ ...req.body, total_cost });
//     return res.status(201).json({ success: true, data: log });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getStats = async (req, res) => {
//   try {
//     const logs = await FuelLog.findAll({ where: { vehicle_id: req.params.vehicle_id } });
//     const totalLitres = logs.reduce((s, l) => s + l.litres, 0);
//     const totalCost   = logs.reduce((s, l) => s + parseFloat(l.total_cost || 0), 0);
//     return res.json({ success: true, data: { totalLitres, totalCost, entries: logs.length } });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.remove = async (req, res) => {
//   try {
//     await FuelLog.destroy({ where: { id: req.params.id } });
//     return res.json({ success: true, message: 'Fuel log deleted' });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }; 
const { Trip, Vehicle, Driver, Route, User, FuelLog } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { status, driver_id, vehicle_id } = req.query;
    const where = {};
    if (status)     where.status     = status;
    if (driver_id)  where.driver_id  = driver_id;
    if (vehicle_id) where.vehicle_id = vehicle_id;
    const trips = await Trip.findAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['registration_no','make'] },
        { model: Driver,  as: 'driver',  attributes: ['id','license_number'], include: [
          { model: User, as: 'user', attributes: ['name'] },
        ] },
        { model: Route,   as: 'route',   attributes: ['name','origin','destination'] },
      ],
      order: [['createdAt','DESC']],
    });
    return res.json({ success: true, data: trips });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.startTrip = async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, status: 'in_progress', start_time: new Date() });
    await Driver.update({ status: 'on_trip' }, { where: { id: trip.driver_id } });
    return res.status(201).json({ success: true, data: trip });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.endTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const {
      end_odometer,
      fuel_used,
      end_location,
      end_time,

      fuel_quantity,
      fuel_cost,
      fuel_station
    } = req.body;

    const distance_km = end_odometer - trip.start_odometer;

    await trip.update({
      status: 'completed',
      end_time: end_time ? new Date(end_time) : new Date(),
      end_odometer,
      fuel_used,
      end_location,
      distance_km,
    });

    await Driver.update(
      { status: 'available' },
      { where: { id: trip.driver_id } }
    );

    // AUTO CREATE FUEL LOG
    if (
      fuel_quantity &&
      fuel_cost &&
      parseFloat(fuel_quantity) > 0
    ) {
      await FuelLog.create({
        vehicle_id: trip.vehicle_id,
        driver_id: trip.driver_id,
        litres: parseFloat(fuel_quantity),
        cost_per_litre:
          parseFloat(fuel_cost) / parseFloat(fuel_quantity),
        total_cost: parseFloat(fuel_cost),
        fuel_type: 'diesel',
        station_name: fuel_station || '',
        odometer_km: end_odometer,
        filled_at: new Date()
      });
    }

    return res.json({
      success: true,
      data: trip
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Driver,  as: 'driver', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: Route,   as: 'route'  },
      ],
    });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    return res.json({ success: true, data: trip });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
