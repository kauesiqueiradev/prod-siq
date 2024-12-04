import fs from 'fs';
import path from 'path';

const rootFolderPath = '\\\\172.16.50.3\\desenhos';

const listFiles = async () => {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(rootFolderPath, (err, files) => {
            if (err) {
                console.log(err);
                reject("erro ao listar os arquivos");
            } else {
                const filesList = files.map(file => file);
                resolve(filesList);
            }
        });
    });
};

const getFile = async (filename: string) => {
    const filePath = path.join(rootFolderPath, filename);

    return new Promise<string>((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(err);
                reject("Arquivo não encontrado");
            } else {
                resolve(filePath);
            }
        });
    });
};

const searchFiles = async (query: string): Promise<{fileName: string, filePath: string}[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(rootFolderPath, (err, files) => {
            if (err) {
                console.log(err);
                reject("Erro ao listar os arquivos");
            } 
            // Filtra arquivos que contêm o termo de busca no nome
            const filteredFiles = files
            .filter(file => file.toUpperCase().includes(query.toUpperCase()))
            .map(file => ({ fileName: file, filePath: path.join(rootFolderPath, file),

             }));
            resolve(filteredFiles);
            
        });
    });
};

export default { listFiles, getFile, searchFiles};