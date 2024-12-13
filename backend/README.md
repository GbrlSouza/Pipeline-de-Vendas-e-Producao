# **Explicação do Backend:**

Esses códigos é o backend do sistema pra gerenciar tarefas de um app pipeline. Tá todo montado em **Node.js** e tá usando o **MySQL** como banco de dados. Vou quebrar em partes pra ficar mais "de boa".

---

### **1. Configuração do banco de dados (`config/db.js`):**
Esse arquivo é o **mocó** onde você fala pro backend onde o banco tá. Tá configurado pra rodar no **localhost** com o usuário `root` e sem senha (default do XAMPP).

```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pipeline_db',
});
```

Resumindo: isso aqui conecta o backend no seu MySQL, tipo a ponte de interlagos ligando as partes.

---

### **2. Controller (`controllers/tasksController.js`):**
Esse arquivo é o "orquestrador". Ele pega as requisições que chegam (tipo, "me dá as tarefas" ou "cria uma nova") e chama as funções certas do model. Depois devolve a resposta.

#### O que ele faz?
- **`getTasks`**: Puxa todas as tarefas.
- **`addTask`**: Adiciona uma nova tarefa.
- **`updateTask`**: Atualiza uma tarefa específica.
- **`deleteTask`**: Exclui uma tarefa.

Se rolar erro (tipo deu ruim no MySQL), ele joga uma resposta com status **500** e uma mensagem estilo "foi mal, deu zebra". Se não achou a tarefa, devolve **404**.

---

### **3. Model (`models/taskModel.js`):**
Aqui tá o **"operário do backend"**, onde rola o contato direto com o banco. Ele tem funções específicas pra executar os comandos SQL.

- **`getAllTasks`**: Dá um SELECT * nas tarefas.
- **`addTask`**: Dá um INSERT pra criar uma tarefa nova.
- **`updateTask`**: Dá um UPDATE numa tarefa com base no `id`.
- **`deleteTask`**: Dá um DELETE com base no `id`.

É basicamente o "faz-tudo" que só fala SQL.

---

### **4. Rotas (`routes/tasks.js`):**
Aqui é onde a mágica das URLs acontece. Tipo, você acessa `/tasks` e ele já sabe qual função do controller tem que chamar.

- **POST `/tasks`** → Cria tarefa (`addTask`).
- **GET `/tasks`** → Lista todas (`getTasks`).
- **PUT `/tasks/:id`** → Atualiza uma (`updateTask`).
- **DELETE `/tasks/:id`** → Exclui uma (`deleteTask`).

---

### **5. O servidor (`index.js`):**
Esse aqui é o **pivô do rolê**. Ele monta o servidor com:
- **`express`** pra gerenciar rotas.
- **`cors`** pra liberar requisições de outros domínios.
- Middleware pra processar JSON.

#### Como roda?
1. Liga o servidor na porta **3000**.
2. Toda vez que chega uma requisição no caminho `/tasks`, ele passa pras rotas (`tasksRoutes`).
3. De lá, as rotas chamam o controller, que chama o model, que chama o banco.

---

### **Resumindo:**
- **`config/db.js`**: Configura o banco (como um passaporte pro banco).
- **`models/taskModel.js`**: Faz a comunicação com o banco (tipo os trampos no chão de fábrica).
- **`controllers/tasksController.js`**: Controla a lógica do que fazer (é tipo o chefe da fábrica).
- **`routes/tasks.js`**: Define pra onde cada requisição vai (é o Waze do backend).
- **`index.js`**: Liga o servidor e organiza tudo (o DJ da festa).

Pronto, com isso o sistema tá redondo pra rodar local. 🏎️

- É isso ai! 😊