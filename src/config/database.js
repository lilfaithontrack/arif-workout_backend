const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'arif_workout',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
);

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`MySQL Connected: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    
    // Sync models in development (creates tables)
    if (process.env.NODE_ENV === 'development') {
      // Temporarily disabled to prevent "too many keys" error
      // await sequelize.sync({ alter: true }); // Auto-update tables to match models
      console.log('⚠️  Database sync disabled (too many indexes issue)');
      
      // Log created tables
      const [tables] = await sequelize.query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
        ORDER BY TABLE_NAME
      `);
      console.log(`📊 Total tables: ${tables.length}`);
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await sequelize.close();
      console.log('MySQL connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
