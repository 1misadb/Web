import sqlite3 from 'sqlite3';

import type StudentInterface from '@/types/StudentInterface';
import getRandomFio from '@/utils/getRandomFio';
import FioInterface from '@/types/FioInterface';

sqlite3.verbose();

/**
 * Получение студентов
 * @returns Promise<StudentInterface[]>
 */
export const getStudentsDb = async (): Promise<StudentInterface[]> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const students = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM student';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      resolve(rows);
      db.close();
    });
  });

  return students as StudentInterface[];
};

/**
 * Удаления студента
 * @param studentId
 * @returns
 */
export const deleteStudentDb = async (studentId: number): Promise<number> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  await new Promise((resolve, reject) => {
    db.run('DELETE FROM student WHERE id=?', [studentId], (err) => {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      resolve(studentId);
      db.close();
    });
  });

  return studentId;
};

export const addRandomStudentsDb = async (amount: number = 10): Promise<FioInterface[]> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const fios: FioInterface[] = [];
  let fiosInsert: string = ''
  for (let i = 0; i < amount; i++) {
    const fio = getRandomFio();
    fios.push(fio);
    fiosInsert += `('${fio.firstName}', '${fio.lastName}', '${fio.middleName}', 1)`;
    fiosInsert += `${i === amount - 1 ? ';' : ','}`;
  }

  await new Promise((resolve, reject) => {
    db.run(`INSERT INTO student (firstName, lastName, middleName, groupId) VALUES ${fiosInsert}`, [], (err) => {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      resolve(fios);
      db.close();
    });
  });

  return fios;
};
export const addStudentDb = async (
  studentData: Omit<StudentInterface, 'id'>
): Promise<StudentInterface | null> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const { firstName, lastsName: lastName, middleName } = studentData;

  const newStudent = await new Promise<StudentInterface | null>((resolve, reject) => {
    const sql = `
      INSERT INTO student (firstName, lastName, middleName, groupId)
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [firstName, lastName, middleName, 1], function (err) {
      if (err) {
        console.error('Ошибка добавления студента:', err);
        reject(err);
        db.close();
        return;
      }

      
      const insertedStudent: StudentInterface = {
        id: this.lastID,
        firstName,
        lastsName: lastName, 
        middleName,
      };

      resolve(insertedStudent);
      db.close();
    });
  });

  return newStudent;
};