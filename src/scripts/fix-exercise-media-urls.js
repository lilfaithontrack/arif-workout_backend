/**
 * One-off fix script: Strip the broken "/public" prefix from Exercise.videoUrl
 * and Exercise.imageUrl rows that were saved by upload.controller.js before the
 * static route + URL prefix were aligned.
 *
 * Before: /public/images/exercises/{slug}/main/{file}  -> 404
 * After:  /images/exercises/{slug}/main/{file}         -> served by express.static
 *
 * Run: node src/scripts/fix-exercise-media-urls.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

async function fixColumn(column) {
    const rows = await sequelize.query(
        `SELECT id, ${column} AS url FROM exercises WHERE ${column} LIKE '/public/images/%'`,
        { type: QueryTypes.SELECT }
    );

    console.log(`[${column}] Found ${rows.length} row(s) with the /public prefix`);

    for (const row of rows) {
        const fixed = row.url.replace(/^\/public\//, '/');
        await sequelize.query(
            `UPDATE exercises SET ${column} = ? WHERE id = ?`,
            { replacements: [fixed, row.id], type: QueryTypes.UPDATE }
        );
        console.log(`  ✓ id=${row.id}: ${row.url} -> ${fixed}`);
    }
}

async function main() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database');

        await fixColumn('videoUrl');
        await fixColumn('imageUrl');

        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error('Fix failed:', err);
        process.exit(1);
    }
}

main();
