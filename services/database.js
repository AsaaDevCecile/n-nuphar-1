// services/database.js
const mongoose = require('mongoose');
const config = require('../config/config');

async function connect() {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

module.exports = { connect };

// services/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, '../data/translation.db'));
        this.init();
    }

    init() {
        this.db.serialize(() => {
            // Table des configurations des salons
            this.db.run(`
                CREATE TABLE IF NOT EXISTS translation_channels (
                    channel_id TEXT PRIMARY KEY,
                    guild_id TEXT NOT NULL,
                    language_code TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Table des statistiques de traduction
            this.db.run(`
                CREATE TABLE IF NOT EXISTS translation_stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    guild_id TEXT NOT NULL,
                    source_channel_id TEXT NOT NULL,
                    target_channel_id TEXT NOT NULL,
                    source_lang TEXT NOT NULL,
                    target_lang TEXT NOT NULL,
                    char_count INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Table des filtres de contenu
            this.db.run(`
                CREATE TABLE IF NOT EXISTS content_filters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    guild_id TEXT NOT NULL,
                    pattern TEXT NOT NULL,
                    action TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        });
    }

    // Méthodes pour les salons de traduction
    async registerChannel(channelId, guildId, languageCode) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT OR REPLACE INTO translation_channels (channel_id, guild_id, language_code) VALUES (?, ?, ?)',
                [channelId, guildId, languageCode],
                (err) => err ? reject(err) : resolve()
            );
        });
    }

    async unregisterChannel(channelId) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'DELETE FROM translation_channels WHERE channel_id = ?',
                [channelId],
                (err) => err ? reject(err) : resolve()
            );
        });
    }

    async getChannelLanguage(channelId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT language_code FROM translation_channels WHERE channel_id = ?',
                [channelId],
                (err, row) => err ? reject(err) : resolve(row?.language_code)
            );
        });
    }

    async getAllChannels(guildId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM translation_channels WHERE guild_id = ?',
                [guildId],
                (err, rows) => err ? reject(err) : resolve(rows)
            );
        });
    }

    // Méthodes pour les statistiques
    async logTranslation(guildId, sourceChannelId, targetChannelId, sourceLang, targetLang, charCount) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO translation_stats 
                (guild_id, source_channel_id, target_channel_id, source_lang, target_lang, char_count) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [guildId, sourceChannelId, targetChannelId, sourceLang, targetLang, charCount],
                (err) => err ? reject(err) : resolve()
            );
        });
    }

    async getTranslationStats(guildId, period = '24h') {
        const timeCondition = {
            '24h': "datetime(created_at) > datetime('now', '-1 day')",
            '7d': "datetime(created_at) > datetime('now', '-7 days')",
            '30d': "datetime(created_at) > datetime('now', '-30 days')",
            'all': '1=1'
        }[period] || '1=1';

        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT 
                    source_lang, 
                    target_lang,
                    COUNT(*) as translation_count,
                    SUM(char_count) as total_chars,
                    AVG(char_count) as avg_chars
                FROM translation_stats 
                WHERE guild_id = ? AND ${timeCondition}
                GROUP BY source_lang, target_lang`,
                [guildId],
                (err, rows) => err ? reject(err) : resolve(rows)
            );
        });
    }
}

module.exports = new Database();