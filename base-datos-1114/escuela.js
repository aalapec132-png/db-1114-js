const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('escuela.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    seccion TEXT NOT NULL,
    edad INTEGER
  )
`);

const alumnos = [
  { nombre: 'Ana', seccion: '1114', edad: 19 },
  { nombre: 'Luis', seccion: '1114', edad: 21 },
  { nombre: 'Marta', seccion: '1113', edad: 20 },
  { nombre: 'Pedro', seccion: '1114', edad: 18 },
];

const insert = db.prepare('INSERT INTO alumnos (nombre, seccion, edad) VALUES (?, ?, ?)');
for (const a of alumnos) {
  insert.run(a.nombre, a.seccion, a.edad);
}

console.log('Datos cargados en escuela.db');
const selSeccion = db.prepare('SELECT * FROM alumnos WHERE seccion = ?');
console.log('Alumnos de 1114:', selSeccion.all('1114'));

const selMayores = db.prepare('SELECT nombre, edad FROM alumnos WHERE edad >= ? ORDER BY edad');
console.log('Mayores de 20:', selMayores.all(20));

const selPrimero = db.prepare('SELECT * FROM alumnos ORDER BY edad DESC LIMIT 1');
console.log('El mas grande:', selPrimero.get());

const selCuenta = db.prepare('SELECT COUNT(*) AS total FROM alumnos');
console.log('Total de alumnos:', selCuenta.get());
const actualizar = db.prepare('UPDATE alumnos SET edad = ? WHERE nombre = ?');
const cambio = actualizar.run(22, 'Ana');
console.log('Filas actualizadas:', cambio.changes);

const borrar = db.prepare('DELETE FROM alumnos WHERE nombre = ?');
const borrado = borrar.run('Marta');
console.log('Filas borradas:', borrado.changes);
const rows = selSeccion.all('1114');
const json = JSON.stringify(rows, null, 2);
console.log('Como JSON:');
console.log(json);
db.exec(`
  CREATE TABLE IF NOT EXISTS cursos (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS inscripciones (
    alumno_id INTEGER,
    curso_id INTEGER,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
  )
`);


 /* Preguntas

1. ¿Qué pasa con este código si necesito 5 filtros? ¿Y si necesito 10?
2. Si cierro el programa, ¿dónde quedaron los datos?
3. ¿Qué alumnos se inscribieron a "Base de Datos"?
4. ¿Cuántos cursos tiene cada alumno?

 Respuestas

 1.El código se hace cada vez más largo y complicado, porque tendría que agregar muchos filtros y sería más difícil de organizar y mantener.
 2.Los datos quedan en la memoria del programa y se pierden cuando lo cierro, porque todavía no están guardados en una base de datos.
 3.Ana, Luis y Pedro.
 4.Ana tiene 2 cursos, Luis tiene 1 curso, Marta tiene 1 curso y Pedro tiene 1 curso. */

/* Frase

 JSON lo uso para organizar y mostrar los datos de una forma sencilla, y SQLite lo uso para guardar esos datos y poder consultarlos aunque cierre el programa. */