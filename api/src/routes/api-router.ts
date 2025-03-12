import express from 'express';
import fs from 'fs';
import path from 'path';

const apiRouter = express.Router()

// const rootFolderPath = '/mnt/win/';
// const rootFolderPath = '172.16.50.2/server 2018\\Sistema de Gestao da Qualidade\\';
// const rootFolderPath = 'X:\\Sistema de Gestao da Qualidade\\';
const rootFolderPath = '\\\\172.16.50.2\\SGQ\\';

if (!rootFolderPath) {
    console.error('Variável de ambiente URL_FOLDER não está definida.');
    process.exit(1);
}

apiRouter.use('files', express.static(path.join(rootFolderPath, '2. Procedimentos')));

apiRouter.get('/get-companies', (req, res) => {
    fs.readdir(rootFolderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler a pasta das empresas' });
        }

        const companies = files.filter(file => 
            fs.statSync(path.join(rootFolderPath, file)).isDirectory()
        );

        res.json({ companies });
    })
});

apiRouter.get('/get-folders', (req, res) => {
    fs.readdir(rootFolderPath, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao ler a pasta' });
        } else {
            const folders = files
                .filter(file => fs.statSync(path.join(rootFolderPath, file)).isDirectory())
            res.json({ folders });
        }
    });
})

apiRouter.get('/get-sectors', (req, res) => {
    const company = req.query.company as string;
    if (!company) {
        return res.status(400).json({ error: 'Nome da empresa não fornecido' });
    }

    const companyPath = path.join(rootFolderPath, company);
    if (!fs.existsSync(companyPath)) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    fs.readdir(companyPath, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao ler os setores' });
        } 

        const sectors = files.filter(file => 
            fs.statSync(path.join(companyPath, file)).isDirectory()
        );

        res.json({ sectors });
    });
});

// apiRouter.get('/get-files', (req, res) => {
//     let folderName = req.query.folder as string;

//     if (!folderName) {
//         return res.status(400).json({ error: 'Nome da pasta não fornecido' });
//     }

//     const subFolderPath = path.join(rootFolderPath, folderName, '2. Procedimentos');

//     fs.readdir(subFolderPath, (err, files) => {
//         if (err) {
//             res.status(500).json({ error: 'Erro ao ler a página' });
//         } else {
//             const fileUrls = files.map(file => {
//                 return {
//                     fileName: file,
//                     fileUrl: `/api/open-file?folder=${encodeURIComponent(folderName)}&file=${encodeURIComponent(file)}`
//                 };
//             });
//             res.json({ files: fileUrls });
//         }
//     })
// })
apiRouter.get('/get-files', (req, res) => {
    const company = req.query.company as string;
    const sector = req.query.sector as string;

    if (!company || !sector) {
        return res.status(400).json({ error: 'Empresa ou setor não informados' });
    }

    const sectorPath = path.join(rootFolderPath, company, sector, '2. Procedimentos');
    if (!fs.existsSync(sectorPath)) {
        return res.status(404).json({ error: 'Setor não encontrado ou sem arquivos' });
    }

    fs.readdir(sectorPath, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao ler os arquivos' });
        } 

        const fileUrls = files.map(file => {
            return {
                fileName: file,
                fileUrl: `/api/get-file?company=${encodeURIComponent(company)}&sector=${encodeURIComponent(sector)}&file=${encodeURIComponent(file)}`
            };
        });

        res.json({ files: fileUrls });
    })
});


apiRouter.get('/get-file', (req,res) => {
    let folder = req.query.folder as string;
    let file = req.query.file as string;
    const filePath = path.join(rootFolderPath, folder, '2. Procedimentos', file);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'Arquivo não encontrado' });
    }
})
// apiRouter.get('/get-file', (req,res) => {
//     const company = req.query.company as string;
//     const sector = req.query.sector as string;
//     const file = req.query.file as string;

//     if (!company || !sector || !file) {
//         return res.status(400).json({ error: 'Parâmetros insuficientes' });
//     }

//     const filePath = path.join(rootFolderPath, company, sector, '2. Procedimentos', file);

//     if (fs.existsSync(filePath)) {
//         res.sendFile(filePath);
//     } else {
//         res.status(404).json({ error: 'Arquivo não encontrado' });
//     }
// });

export default apiRouter