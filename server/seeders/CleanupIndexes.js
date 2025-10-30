import sequelize from '../config/db.js';

const cleanupIndexes = async () => {
  const [results] = await sequelize.query('SHOW INDEX FROM categories');
  const nameIndexes = results
    .filter((i) => i.Column_name === 'name' && i.Key_name !== 'PRIMARY')
    .map((i) => i.Key_name);

  // keep only the first one
  for (let i = 1; i < nameIndexes.length; i++) {
    await sequelize.query(`ALTER TABLE categories DROP INDEX ${nameIndexes[i]}`);
  }

  console.log('✅ Cleaned duplicate name indexes');
  process.exit(0);
};

cleanupIndexes();
