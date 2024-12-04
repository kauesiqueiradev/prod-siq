import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import fileController from "../controllers/fileControllers";

const fichaRouter = express.Router();

const rootFolderPath: string = "\\\\172.16.50.3\\desenhos";


fichaRouter.get("/files", async (req: Request, res: Response) => {
    try {
       const fileList = await fileController.listFiles();
       const formattedList = fileList.map(file => ({
           filename: file,
           filepath: path.join(rootFolderPath, file),
       }));
       res.json({ files: formattedList});
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao listar os arquivos");
    }
   });

   
fichaRouter.get("/files/:filename", async (req: Request, res: Response) => {
    const fileName = req.params.filename;
    
    try {
        const filePath = await fileController.getFile(fileName);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(filePath);
    } catch (err) {
        console.error(err);
        res.status(500).send("Arquivo não encontrado");
    }
});


fichaRouter.get("/file/search", async (req: Request, res: Response) => {
    const query = req.query.query as string;

    if (!query) {
        return res.status(400).json({ error: " A consulta de busca é obrigatória!"});
    }

    try {
        const filteredFiles = await fileController.searchFiles(query);
        res.json({ files: filteredFiles });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar os arquivos");
    }
});

export default fichaRouter;