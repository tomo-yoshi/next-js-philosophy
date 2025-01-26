import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dbPath } from './constant';

export const openDatabase = async() => {
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
};