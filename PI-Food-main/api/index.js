const server = require('./src/app.js');
const { createDiets } = require('./src/controllers/controllers.js');
const { db } = require('./src/db.js');

const PORT = 3001;

// Syncing all the models at once.
db.sync({ force: true }).then(() => {
  server.listen(PORT, async () => {
    await createDiets(); // Precarga la BDD con las dietas
    console.log(`Server listening at ${PORT}`); // eslint-disable-line no-console
    
  });
});

// Conectando el servidor con la base de datos de otra forma

/*
server.listen(PORT, async () => {
  await db.sync({ force: true });
  await createDiets(); // Precarga la BDD con las dietas
  console.log(`Server listening on port ${PORT}`);
}); 

*/
