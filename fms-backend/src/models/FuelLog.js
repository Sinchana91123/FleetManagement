// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const FuelLog = sequelize.define('FuelLog', {
//   id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   vehicle_id:     { type: DataTypes.INTEGER, allowNull: false },
//   driver_id:      { type: DataTypes.INTEGER },
//   litres:         { type: DataTypes.FLOAT, allowNull: false },
//   cost_per_litre: { type: DataTypes.DECIMAL(8,2) },
//   total_cost:     { type: DataTypes.DECIMAL(10,2) },
//   odometer_km:    { type: DataTypes.FLOAT },
//   fuel_type:      { type: DataTypes.STRING(20) },
//   station_name:   { type: DataTypes.STRING(100) },
//   filled_at:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
// }, { tableName: 'fuel_logs', timestamps: true });

// module.exports = FuelLog;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FuelLog = sequelize.define('FuelLog', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vehicle_id:     { type: DataTypes.INTEGER, allowNull: false },
  driver_id:      { type: DataTypes.INTEGER },
  litres:         { type: DataTypes.FLOAT, allowNull: false },
  cost_per_litre: { type: DataTypes.DECIMAL(8,2) },
  total_cost:     { type: DataTypes.DECIMAL(10,2) },
  odometer_km:    { type: DataTypes.FLOAT },
  fuel_type:      { type: DataTypes.STRING(20) },
  station_name:   { type: DataTypes.STRING(100) },
  filled_at:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'fuel_logs', timestamps: true });

module.exports = FuelLog;
