import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

// Initialize the SQLite database
export const initializeDatabase = async () => {
  try {
    // Open the database asynchronously
    db = await SQLite.openDatabaseAsync('app.db');
    console.log('Database opened successfully');
    await dropAllTables();
    // Execute SQL commands for table creation
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS years (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year_id INTEGER,
        group_name TEXT NOT NULL,
        FOREIGN KEY (year_id) REFERENCES years(id)
      );
      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER,
        subject_name TEXT NOT NULL,
        day TEXT NOT NULL,
        hour TEXT NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Function to drop all tables
export const dropAllTables = async () => {
  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS subjects;
      DROP TABLE IF EXISTS groups;
      DROP TABLE IF EXISTS years;
    `);
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
  }
};

// Insert sample data (only run once)
export const insertSampleData = async () => {
  try {
    await db.execAsync(`
      INSERT INTO years (year) VALUES ('2022');
      INSERT INTO years (year) VALUES ('2023');
      INSERT INTO years (year) VALUES ('2024');

      INSERT INTO groups (year_id, group_name) VALUES (1, 'Group 1');
      INSERT INTO groups (year_id, group_name) VALUES (1, 'Group 2');
      INSERT INTO groups (year_id, group_name) VALUES (2, 'Group A');
      INSERT INTO groups (year_id, group_name) VALUES (2, 'Group B');

      -- Insert subjects with day and hour
      INSERT INTO subjects (group_id, subject_name, day, hour) VALUES (1, 'AI', 'Monday', '09:00 AM');
      INSERT INTO subjects (group_id, subject_name, day, hour) VALUES (1, 'Proiect Colectiv', 'Tuesday', '11:00 AM');
      INSERT INTO subjects (group_id, subject_name, day, hour) VALUES (2, 'Limba Spaniola', 'Wednesday', '10:00 AM');
      INSERT INTO subjects (group_id, subject_name, day, hour) VALUES (2, 'Matematica', 'Thursday', '02:00 PM');
      INSERT INTO subjects (group_id, subject_name, day, hour) VALUES (3, 'Fizica', 'Friday', '01:00 PM');
    `);
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

// Fetch all years
export const fetchYears = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM years');
    return result;
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
};

// Fetch groups by year ID
export const fetchGroups = async (yearId: number) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM groups WHERE year_id = ?', [yearId]);
    return result;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

// Fetch subjects by group ID
export const fetchSubjects = async (groupId: number) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM subjects WHERE group_id = ?', [groupId]);
    return result;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
};

// Fetch the full schedule for a group
export const fetchSubjectSchedule = async (groupId: number) => {
  try {
    const result = await db.getAllAsync(`
      SELECT subject_name, day, hour
      FROM subjects
      WHERE group_id = ?
      ORDER BY
        CASE day
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
        END,
        hour
    `, [groupId]);
    console.log('Fetched subject schedule:', result);
    return result;
  } catch (error) {
    console.error('Error fetching subject schedule:', error);
    return [];
  }
};
