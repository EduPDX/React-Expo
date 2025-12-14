import * as SQLite from 'expo-sqlite';
import { Consulta, Paciente } from '../types';

const db = SQLite.openDatabaseSync('database.db');

export const initDatabase = () => {
  //TABELA PACIENTES
  db.execSync(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      idade INTEGER NOT NULL
    );
  `);

  //TABELA CONSULTAS
  db.execSync(`
    CREATE TABLE IF NOT EXISTS consultas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      descricao TEXT NOT NULL,
      FOREIGN KEY (paciente_id) REFERENCES pacientes (id)
    );
  `);

  //REMOVE CONSULTAS ÓRFÃS
  db.execSync(`
    DELETE FROM consultas
    WHERE paciente_id NOT IN (SELECT id FROM pacientes);
  `);
};

//CRUD PACIENTES
export const createPaciente = (paciente: Omit<Paciente, 'id'>) => {
  const result = db.runSync(
    'INSERT INTO pacientes (nome, telefone, idade) VALUES (?, ?, ?)',
    [paciente.nome, paciente.telefone, paciente.idade]
  );
  return result.lastInsertRowId;
};

export const getPacientes = (): Paciente[] => {
  return db.getAllSync(
    'SELECT * FROM pacientes ORDER BY nome'
  ) as Paciente[];
};

export const updatePaciente = (
  id: number,
  paciente: Omit<Paciente, 'id'>
) => {
  db.runSync(
    'UPDATE pacientes SET nome = ?, telefone = ?, idade = ? WHERE id = ?',
    [paciente.nome, paciente.telefone, paciente.idade, id]
  );
};

export const deletePaciente = (id: number) => {
  db.runSync('DELETE FROM consultas WHERE paciente_id = ?', [id]);
  db.runSync('DELETE FROM pacientes WHERE id = ?', [id]);
};

//CRUD CONSULTAS
export const createConsulta = (consulta: Omit<Consulta, 'id'>) => {
  const result = db.runSync(
    'INSERT INTO consultas (paciente_id, data, descricao) VALUES (?, ?, ?)',
    [consulta.paciente_id, consulta.data, consulta.descricao]
  );
  return result.lastInsertRowId;
};

export const getConsultas = (): Consulta[] => {
  return db.getAllSync(`
    SELECT c.*, p.nome as paciente_nome
    FROM consultas c
    JOIN pacientes p ON c.paciente_id = p.id
    ORDER BY c.data DESC
  `) as Consulta[];
};

export const updateConsulta = (
  id: number,
  consulta: Omit<Consulta, 'id'>
) => {
  db.runSync(
    'UPDATE consultas SET paciente_id = ?, data = ?, descricao = ? WHERE id = ?',
    [consulta.paciente_id, consulta.data, consulta.descricao, id]
  );
};

export const deleteConsulta = (id: number) => {
  db.runSync('DELETE FROM consultas WHERE id = ?', [id]);
};

//DASHBOARD
export const getTotalPacientes = (): number => {
  const result = db.getFirstSync(
    'SELECT COUNT(*) as total FROM pacientes'
  ) as { total: number };

  return result.total;
};

export const getTotalConsultas = (): number => {
  const result = db.getFirstSync(`
    SELECT COUNT(*) as total
    FROM consultas c
    JOIN pacientes p ON c.paciente_id = p.id
  `) as { total: number };

  return result.total;
};

export const getUltimasConsultas = (): Consulta[] => {
  return db.getAllSync(`
    SELECT c.*, p.nome as paciente_nome
    FROM consultas c
    JOIN pacientes p ON c.paciente_id = p.id
    ORDER BY c.id DESC
    LIMIT 3
  `) as Consulta[];
};

export const getProximasConsultas = (): Consulta[] => {
  return db.getAllSync(`
    SELECT c.*, p.nome as paciente_nome
    FROM consultas c
    JOIN pacientes p ON c.paciente_id = p.id
    ORDER BY c.data ASC
    LIMIT 3
  `) as Consulta[];
};

