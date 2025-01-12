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
        type INTEGER NOT NULL CHECK (type IN (1, 2, 3, 4)),
        FOREIGN KEY (group_id) REFERENCES groups(id)
      );
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'user'))
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
  return db; // Return the database instance
};
export { db };

// Function to drop all tables
export const dropAllTables = async () => {
  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS accounts;
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

      -- Insert subjects with day, hour, and type
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (1, 'AI', 'Monday', '09:00 AM', 1);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (1, 'Proiect Colectiv', 'Tuesday', '11:00 AM', 2);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (2, 'Limba Spaniola', 'Wednesday', '10:00 AM', 3);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (2, 'Matematica', 'Thursday', '02:00 PM', 1);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (3, 'Fizica', 'Friday', '01:00 PM', 2);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (1, 'History', 'Monday', '10:00 AM', 4);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (1, 'Geography', 'Monday', '11:00 AM', 4);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (2, 'Art', 'Tuesday', '09:00 AM', 4);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (2, 'Music', 'Tuesday', '10:00 AM', 4);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (3, 'Philosophy', 'Wednesday', '11:00 AM', 4);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (3, 'Ethics', 'Wednesday', '12:00 PM', 4);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (4, 'Drama', 'Thursday', '01:00 PM', 4);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (4, 'Economics', 'Thursday', '02:00 PM', 4);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (4, 'Political Science', 'Friday', '09:00 AM', 4);
      INSERT INTO subjects (group_id, subject_name, day, hour, type) VALUES (4, 'Statistics', 'Friday', '10:00 AM', 4);

      

      -- Insert sample accounts
      INSERT INTO accounts (username, password, role) VALUES ('admin', 'admin123', 'admin');
      INSERT INTO accounts (username, password, role) VALUES ('user1', 'password1', 'user');
      INSERT INTO accounts (username, password, role) VALUES ('user2', 'password2', 'user');
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

type Subject = {
  id: number;
  group_id: number;
  subject_name: string;
  day: string;
  hour: string;
  type: number;
};

// Fetch subjects by group ID
export const fetchSubjects = async (groupId: number): Promise<Subject[]> => {
  try {
    const result = await db.getAllAsync('SELECT * FROM subjects WHERE group_id = ?', [groupId]);
    return result as Subject[]; // Cast the result to the Subject array
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
};


// Fetch the full schedule for a group
export const fetchSubjectSchedule = async (groupId: number) => {
  try {
    const result = await db.getAllAsync(`
      SELECT subject_name, day, hour, type
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

// Fetch all users
export const fetchUsers = async (): Promise<{ id: number; username: string; password: string; role: string; }[]> => {
  try {
    const result = await db.getAllAsync('SELECT id, username, password, role FROM accounts');
    console.log('Fetched users:', result);
    return result as { id: number; username: string; password: string; role: string; }[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
