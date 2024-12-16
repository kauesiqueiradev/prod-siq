import express from 'express';
import fs from 'fs';
import path from 'path';

const moviesRouter = express.Router()

const rootFolderPath = '\\\\172.16.50.2\\sequencia_videos\\';
// X:\Costura\1. Arquivo em geral\01. Sequências Operacionais\02. Sequências Operacionais


interface Video {
  name: string;
  type: 'video';
  path: string;
}

interface Category {
  folder: string;
  videos: Video[];
  categories: Category[];
}

if (!rootFolderPath) {
  console.error('Caminho da pasta raiz não definido.');
  process.exit(1);
}

// Tipos de arquivos de vídeo aceitos
const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov'];

function getFolderContents(folderPath: string): any[] {
  // const items = fs.readdirSync(folderPath);
  // return items.map(item => {
  //   const fullPath = path.join(folderPath, item);
  //   const stats = fs.statSync(fullPath);

  //   if (stats.isDirectory()) {
  //     return {
  //       name: item,
  //       type: 'folder',
  //       contents: getFolderContents(fullPath),
  //     };
  //   } else if (stats.isFile() && videoExtensions.includes(path.extname(item).toLocaleLowerCase())) {
  //     return {
  //       name: item,
  //       type: 'video',
  //       path: fullPath,
  //     };
  //   }
  //   return null;
  // }).filter(Boolean);
  try {
    const items = fs.readdirSync(folderPath);
    return items.map(item => {
      const fullPath = path.join(folderPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        return { name: item, type: 'folder' }; // Pasta
      } else if (stats.isFile() && videoExtensions.includes(path.extname(item).toLowerCase())) {
        return { name: item, type: 'video', path: fullPath }; // Arquivo de vídeo
      }
      return null;
    }).filter(Boolean); // Remove itens nulos
  } catch (error) {
    console.error(`Erro ao acessar a pasta: ${folderPath}`, error);
    return [];
  }
}

moviesRouter.get('/get-folders', (req, res) => {
  console.log('Rota /get-folders acessada 1');
  // try {
  //   const folders = getFolderContents(rootFolderPath);
  //   res.json({ folders });
  // } catch (error) {
  //   console.error('Erro ao listar pastas: ', error); 
  //   console.log('eror:', error);
  //   res.status(500).json({ error: "Erro ao listar pastas"});
  // }
  const relativePath = req.query.path || ''; // Recebe o caminho relativo
  const folderPath = path.join(rootFolderPath, relativePath as string);

  if (!fs.existsSync(folderPath)) {
    return res.status(400).json({ error: 'Caminho inválido ou não encontrado.' });
  }

  const contents = getFolderContents(folderPath);
  const parentPath = relativePath ? path.dirname(relativePath as string) : null; // Caminho da pasta pai

  res.json({
    currentPath: relativePath, // Caminho atual
    parentPath, // Caminho para voltar
    contents, // Conteúdo da pasta atual
  });
});

moviesRouter.get('/play-video', (req, res) => {
  const videoPath = req.query.path as string;

  if (!fs.existsSync(videoPath)) {
    return res.status(400).json({ error: "Arquivo de video inválido ou não encontrado" });
  }

  res.sendFile(videoPath);
});

moviesRouter.get('/get-categories', (req, res) => {
  function getCategoryStructure(folderPath: string): Category {
    const items = fs.readdirSync(folderPath);
    const categories: Category[] = [];
    const videos: Video[] = [] as any;

    items.forEach(item => {
      const fullPath = path.join(folderPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        categories.push( getCategoryStructure(fullPath));
      } else if (stats.isFile() && videoExtensions.includes(path.extname(item).toLowerCase())) {
        videos.push({
          name: item,
          path: fullPath,
          type: 'video'
        });
      }     
    });

    return {
      folder: folderPath,
      videos: videos,
      categories: categories
    };
  }

  try {
    const data = getCategoryStructure(rootFolderPath);
    console.log("Dados: ",data.categories);
    console.log("Dados completos: ", JSON.stringify(data, null, 2));
    res.json({ categories: data });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro ao listar categorias' });
  }
});

export default moviesRouter