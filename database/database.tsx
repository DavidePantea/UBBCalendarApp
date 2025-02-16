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
      CREATE TABLE IF NOT EXISTS user_subjects (
        user_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, subject_id),
        FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year_id INTEGER,
        group_name TEXT NOT NULL,
        FOREIGN KEY (year_id) REFERENCES years(id)
      );
      CREATE TABLE IF NOT EXISTS professors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        department TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_name TEXT NOT NULL,
        place_name TEXT NOT NULL,
        address TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER,
        subject_name TEXT NOT NULL,
        day TEXT NOT NULL,
        hour TEXT NOT NULL,
        type INTEGER NOT NULL CHECK (type IN (1, 2, 3, 4)),
        place_id INTEGER,  -- Now references the places table
        professor_id INTEGER,
        FOREIGN KEY (group_id) REFERENCES groups(id),
        FOREIGN KEY (professor_id) REFERENCES professors(id),
        FOREIGN KEY (place_id) REFERENCES places(id)  
    );
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
      year_id INTEGER DEFAULT NULL,  -- Allow users to store their selected year
      group_id INTEGER DEFAULT NULL, -- Allow users to store their selected group
      FOREIGN KEY (year_id) REFERENCES years(id),
      FOREIGN KEY (group_id) REFERENCES groups(id)
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
      DROP TABLE IF EXISTS professors;
      DROP TABLE IF EXISTS places;
      DROP TABLE IF EXISTS user_subjects;

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

    INSERT INTO professors (name, title, department) VALUES
    ('John Doe', 'Professor', 'Computer Science'),
    ('Jane Smith', 'Associate Professor', 'Mathematics'),
    ('Emily Johnson', 'Lecturer', 'Physics'),
    ('Michael Brown', 'Professor', 'History'),
    ('David Williams', 'Assistant Professor', 'Philosophy');

    INSERT INTO places (room_name, place_name, address) VALUES
    ('Room 101', 'Main Building', '123 University St'),
    ('Room 102', 'Science Block', '456 Science Ave'),
    ('Room 103', 'Library', '789 Knowledge Rd'),
    ('Room 104', 'Engineering Hall', '321 Tech Blvd'),
    ('Room 105', 'Physics Center', '654 Quantum St'),
    ('Room 106', 'History Department', '147 Heritage Ln'),
    ('Room 107', 'Geography Wing', '258 Global Ave'),
    ('Room 108', 'Art Studio', '369 Creative St'),
    ('Room 109', 'Music Hall', '741 Symphony Rd');

    -- Insert subjects, ensuring compatibility with years and groups
    INSERT INTO subjects (group_id, subject_name, day, hour, type, place_id, professor_id) VALUES
    (1, 'AI', 'Monday', '09:00 AM', 1, 1, 1),   -- Group 1
    (1, 'Proiect Colectiv', 'Tuesday', '11:00 AM', 2, 2, 2),  
    (2, 'Limba Spaniola', 'Wednesday', '10:00 AM', 3, 3, 3),  -- Group 2
    (2, 'Matematica', 'Thursday', '02:00 PM', 1, 4, 2),  
    (2, 'History', 'Monday', '10:00 AM', 4, 6, 4),  
    (1, 'Geography', 'Monday', '11:00 AM', 4, 7, 4),  
    (2, 'Art', 'Tuesday', '09:00 AM', 4, 8, 5),  
    (2, 'Music', 'Tuesday', '10:00 AM', 4, 9, 5);  

    -- Insert sample accounts
    INSERT INTO accounts (username, password, role) VALUES ('admin', 'admin123', 'admin');
    INSERT INTO accounts (username, password, role) VALUES ('user1', 'password1', 'user');
    INSERT INTO accounts (username, password, role) VALUES ('user2', 'password2', 'user');

    -- ✅ Insert user3 with pre-selected year, group, and subjects
    INSERT INTO accounts (username, password, role, year_id, group_id) VALUES ('user3', 'password3', 'user', 1, 1); 

    -- ✅ Assign subjects to user3 (Group 1, Year 1)
    INSERT INTO user_subjects (user_id, subject_id) VALUES (4, 1); -- AI (Group 1)
    INSERT INTO user_subjects (user_id, subject_id) VALUES (4, 2); -- Proiect Colectiv (Group 1)
    INSERT INTO user_subjects (user_id, subject_id) VALUES (4, 6); -- Geography (Group 1);
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

type SubjectDetails = {
  subject_name: string;
  day: string;
  hour: string;
  type: number;
  address: string; // Ensure the property exists in the database
  place_name: string;
  room_name: string;
  professor_name?: string;
  title?: string;
  department?: string;
};

export const fetchSubjectById = async (subjectName: string, groupId: number): Promise<SubjectDetails | null> => {
  try {
    const result = await db.getFirstAsync(
      `SELECT subjects.*, 
              places.address, places.room_name, places.place_name, 
              professors.name AS professor_name, professors.title, professors.department
       FROM subjects
       LEFT JOIN places ON subjects.place_id = places.id
       LEFT JOIN professors ON subjects.professor_id = professors.id
       WHERE subjects.subject_name = ? AND subjects.group_id = ?`,
      [subjectName, groupId]
    );

    return result ? (result as SubjectDetails) : null;
  } catch (error) {
    console.error('Error fetching subject details:', error);
    return null;
  }
};

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const result = await db.getAllAsync(
      `SELECT id, username, password, role FROM accounts`
    );
    return result as User[]; // Ensure TypeScript knows the structure
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
};

export const updateUserYearAndGroup = async (userId: number, yearId: number, groupId: number) => {
  try {
    await db.runAsync(
      `UPDATE accounts SET year_id = ?, group_id = ? WHERE id = ?`,
      [yearId, groupId, userId]
    );

    console.log(`✅ User ${userId} updated to Year ${yearId}, Group ${groupId}.`);
  } catch (error) {
    console.error('❌ Error updating user year & group:', error);
  }
};

export const addUserSubject = async (userId: number, subjectId: number) => {
  try {
    await db.runAsync(
      `INSERT INTO user_subjects (user_id, subject_id) VALUES (?, ?)`,
      [userId, subjectId]
    );

    console.log(`✅ Subject ${subjectId} added for User ${userId} successfully.`);
  } catch (error) {
    console.error('❌ Error adding subject:', error);
  }
};

export const removeUserSubject = async (userId: number, subjectId: number) => {
  try {
    await db.runAsync(
      `DELETE FROM user_subjects WHERE user_id = ? AND subject_id = ?`,
      [userId, subjectId]
    );

    console.log(`✅ Subject ${subjectId} removed for User ${userId}.`);
  } catch (error) {
    console.error('❌ Error removing subject:', error);
  }
};


export const fetchUserSubjects = async (userId: number) => {
  try {
    const result = await db.getAllAsync(
      'SELECT subject_id FROM user_subjects WHERE user_id = ?',
      [userId]
    );
    return result; // Should return an array of objects: [{ subject_id: 1 }, { subject_id: 2 }]
  } catch (error) {
    console.error('❌ Error fetching user subjects:', error);
    return [];
  }
};

export const fetchUserDetails = async (userId: number) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT id, username, role, year_id, group_id FROM accounts WHERE id = ?`,
      [userId]
    );

    if (!result) {
      console.error(`❌ No details found for userId: ${userId}`);
      return null; // Explicitly return null
    }

    console.log(`✅ FetchUserDetails Result for userId ${userId}:`, result);
    return result; // This should now always return an object with year_id and group_id
  } catch (error) {
    console.error('❌ Error fetching user details:', error);
    return null;
  }
};

export const addSubject = async (
  groupId: number,
  subjectName: string,
  day: string,
  hour: string,
  type: number,
  placeId: number,
  professorId: number
) => {
  const query = `
    INSERT INTO subjects (group_id, subject_name, day, hour, type, place_id, professor_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await db.runAsync(query, [
    groupId,
    subjectName,
    day,
    hour,
    type,
    placeId,
    professorId,
  ]);
};

export const deleteSubject = async (subjectId: number): Promise<void> => {
  try {
    await db.runAsync(`DELETE FROM subjects WHERE id = ?`, [subjectId]);
    console.log(`✅ Subject ID ${subjectId} deleted.`);
  } catch (error) {
    console.error('❌ Error deleting subject:', error);
  }
};

export const fetchProfessors = async (): Promise<{ id: number; name: string }[]> => {
  return await db.getAllAsync(`SELECT id, name FROM professors`);
};

export const fetchPlaces = async (): Promise<{ id: number; room_name: string; place_name: string }[]> => {
  return await db.getAllAsync(`SELECT id, room_name, place_name FROM places`);
};

export const fetchAllSubjects = async (): Promise<{ id: number; subject_name: string }[]> => {
  try {
    return await db.getAllAsync('SELECT id, subject_name FROM subjects');
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
};

export const fetchAllGroups = async (): Promise<{ id: number; group_name: string }[]> => {
  try {
    return await db.getAllAsync('SELECT id, group_name FROM groups');
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export const fetchAllProfessors = async (): Promise<{ id: number; name: string }[]> => {
  try {
    return await db.getAllAsync('SELECT id, name FROM professors');
  } catch (error) {
    console.error('Error fetching professors:', error);
    return [];
  }
};

export const fetchAllPlaces = async (): Promise<{ id: number; room_name: string; place_name: string }[]> => {
  try {
    return await db.getAllAsync('SELECT id, room_name, place_name FROM places');
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

