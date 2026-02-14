import pool from '../config/db.js';

export const RoomService = {
  /* Trouver une salle par son nom ou la crée si elle n'existe pas*/
  async findOrCreateRoom(roomName) {
    const query = `
      INSERT INTO rooms (room_name) 
      VALUES ($1) 
      ON CONFLICT (room_name) DO UPDATE SET room_name = EXCLUDED.room_name
      RETURNING *;
    `;
    const res = await pool.query(query, [roomName]);
    return res.rows[0];
  },

  /* Trouve un utilisateur par son pseudo ou le crée s'il n'existe pas*/
  async findOrCreateUser(username) {
    const query = `
      INSERT INTO users (username) 
      VALUES ($1) 
      ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
      RETURNING *;
    `;
    const res = await pool.query(query, [username]);
    return res.rows[0];
  }
};