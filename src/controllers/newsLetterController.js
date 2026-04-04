import { pool } from "../db/index.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      "INSERT INTO subscribers (email) VALUES ($1) RETURNING *",
      [email]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(400).json({ message: "Email already exists" });
  }
};