## API

### No "server.ts"

### Trocar a URL da Aplicação para comunicação:
Base Produção: `const url = 'siq.grupotecnotextil.com';`
<br>
Base Teste: `const url = 'localhost';`

#### Trocar o cors que está setado: 
Base Produção: 
``` 
    app.use(cors({
        origin: 'http://siq.grupotecnotextil.com',
        credentials: true,
    }))
```

Base Teste: 
``` 
    app.use(cors({
        origin: 'http://localhost:4200',
        credentials: true,
    }))
```

#

## APP_PROCEDIMENTOS

### No data/data.service.ts

###
Base Produção:`private apiUrl = 'http://siq.grupotecnotextil.com:3000/api';`
Base Teste: `private apiUrl = 'http://localhost:3000/api';`
