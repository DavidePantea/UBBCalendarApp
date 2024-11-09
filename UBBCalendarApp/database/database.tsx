import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

// Initialize the SQLite database
export const initializeDatabase = async () => {
  try {
    // Open the database asynchronously
    db = await SQLite.openDatabaseAsync('app.db');
    console.log('Database opened successfully');

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
        FOREIGN KEY (group_id) REFERENCES groups(id)
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
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
      INSERT INTO subjects (group_id, subject_name) VALUES (1, 'AI');
      INSERT INTO subjects (group_id, subject_name) VALUES (1, 'Proiect Colectiv');
      INSERT INTO subjects (group_id, subject_name) VALUES (2, 'Limba Spaniola');
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
