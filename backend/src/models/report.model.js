const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model'); // User who submits the report
const Service = require('./service.model'); // Example of a service being reported

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    reportedEntityId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    reportedEntityType: {
        type: DataTypes.ENUM('user', 'service', 'review', 'ad'),
        allowNull: false,
    },
    reporterId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: User, key: 'id' },
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'resolved', 'dismissed'),
        defaultValue: 'pending',
    },
}, {
    timestamps: true,
});

// Associations
User.hasMany(Report, { foreignKey: 'reporterId' });
Report.belongsTo(User, { foreignKey: 'reporterId' });

module.exports = Report;
