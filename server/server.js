const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const postRoutes = require('./routes/joyasRoutes');
const dotenv = require('dotenv');


dotenv.config();

if (!process.env.PORT) {
    throw new Error('La variable de entorno PORT es necesaria para iniciar el servidor.');
}

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan('combined'));

app.use(express.json());
app.use(cors());
app.use('/joyas', postRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

app.listen(PORT, () => {
  console.log(`🔥 Server on 🔥 http://localhost:${PORT}`);
});
