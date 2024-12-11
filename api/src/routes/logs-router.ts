import express from 'express';
const router = express.Router();

const logsRouter = express.Router()

logsRouter.post('/log', async (req, res) => {
    const { action, details, timestamp, userId } = req.body;

    if (!action || timestamp) {
        return res.status(400).json({ message: 'Dados Inválidos' });
    }

    // para armazenar no banco, aqui ter que mudar para outro formato
    // await LogModel.create({ action, details, timestamp, userId });

    res.status(201).send({ mesasge: 'Log registrado' });

});

export default logsRouter;