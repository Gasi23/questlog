# ⚔️ QuestLog — Rotina Gamificada

> Transforme sua rotina em uma aventura épica. Complete tarefas, ganhe XP, suba de nível e compita com amigos.

---

## 🗂️ Estrutura do Projeto

```
questlog/
├── backend/          # Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js   # Schema de usuário com XP/nível
│   │   └── Task.js   # Schema de tarefas (diária/semanal/meta)
│   ├── routes/
│   │   ├── auth.js        # Registro, login, /me
│   │   ├── tasks.js       # CRUD + completar tarefas
│   │   ├── users.js       # Perfil, amigos, busca
│   │   └── leaderboard.js # Ranking global e de amigos
│   ├── middleware/
│   │   └── auth.js   # JWT middleware
│   ├── server.js
│   ├── Dockerfile
│   └── .env.example
├── frontend/         # React Native (Expo)
│   ├── context/
│   │   └── AuthContext.js  # Auth state global
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js        # Lista de quests + criar tarefa
│   │   ├── ProfileScreen.js     # Nível, XP, conquistas
│   │   └── LeaderboardScreen.js # Ranking + buscar amigos
│   ├── utils/
│   │   ├── api.js    # Axios + endpoints
│   │   └── theme.js  # Cores, fontes, constantes
│   ├── App.js        # Navegação principal
│   └── app.json
└── docker-compose.yml
```

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- MongoDB (local ou Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode (ou Expo Go no celular)

---

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com sua MONGO_URI e JWT_SECRET

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start
```

O servidor sobe em `http://localhost:3000`

---

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar URL da API
# Edite utils/api.js e altere API_URL para o IP do seu backend:
# export const API_URL = 'http://SEU_IP:3000/api';
# (use o IP da sua máquina na rede local, não localhost, para testar no celular)

# Iniciar Expo
npx expo start

# Escanear QR code com Expo Go (Android/iOS)
# ou pressionar 'a' para Android, 'i' para iOS
```

---

### Com Docker (backend + MongoDB)

```bash
# Na raiz do projeto
docker-compose up -d

# O backend estará em http://localhost:3000
# MongoDB em localhost:27017
```

---

## 🎮 Funcionalidades

### Autenticação
- Cadastro com nome, email, senha e escolha de classe (Guerreiro, Mago, Ladino, Paladino)
- Login com JWT (token salvo no AsyncStorage, válido por 30 dias)
- Auto-login ao reabrir o app

### Tarefas / Quests
| Tipo     | Descrição                                    | Reset      |
|----------|----------------------------------------------|------------|
| Diária   | Repete todo dia, penalidade se não completar | Meia-noite |
| Semanal  | Repete toda semana                           | Semanal    |
| Meta     | Única, desativada após concluir              | Nunca      |

### Dificuldades e XP
| Dificuldade | XP Ganho | Penalidade |
|-------------|----------|------------|
| 🌿 Fácil    | +10 XP   | -5 XP      |
| ⚔️ Médio    | +25 XP   | -10 XP     |
| 🔥 Difícil  | +50 XP   | -20 XP     |
| 💀 Épico    | +100 XP  | -35 XP     |

### Sistema de Níveis
- Fórmula: `nível = floor(sqrt(xp / 100)) + 1`
- Level up automático com modal de celebração
- Barra de progresso de XP em tempo real

### Streak (Sequência)
- Contador de dias consecutivos de login
- Bônus de XP para diárias com streak:
  - 7+ dias: +50% XP
  - 30+ dias: +100% XP

### Conquistas (Badges)
| Badge          | Condição              |
|----------------|-----------------------|
| ⚔️ First Quest  | 1ª tarefa completa    |
| 🛡️ Warrior     | 10 tarefas            |
| 🏆 Champion    | 50 tarefas            |
| 👑 Legend      | 100 tarefas           |
| 🔥 Week Streak | 7 dias de streak      |
| 💫 Month Streak| 30 dias de streak     |
| ⭐ Apprentice  | Nível 5               |
| 🌟 Veteran     | Nível 10              |
| 💎 Master      | Nível 20              |

### Ranking
- **Global**: Top 50 jogadores por XP
- **Amigos**: Ranking apenas entre seus amigos
- **Busca**: Encontre e adicione amigos pelo nome/email

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register  { name, email, password, avatar }
POST /api/auth/login     { email, password }
GET  /api/auth/me        (requer token)
```

### Tasks
```
GET    /api/tasks              ?type=daily|weekly|goal
POST   /api/tasks              { title, description, type, difficulty, icon }
PUT    /api/tasks/:id          { title, description, difficulty, ... }
DELETE /api/tasks/:id
POST   /api/tasks/:id/complete
POST   /api/tasks/:id/uncomplete
```

### Users
```
GET  /api/users/profile/:id
PUT  /api/users/profile        { name, avatar }
GET  /api/users/search         ?q=query
POST /api/users/friends/:id
GET  /api/users/friends
```

### Leaderboard
```
GET /api/leaderboard/global
GET /api/leaderboard/friends
```

---

## 🎨 Design System

- **Tema**: Dark mode total (`#0D0D1A` base)
- **Cor primária**: Electric Purple (`#7C3AED`)
- **Destaque**: Neon Gold (`#F59E0B`)
- **Gradientes**: Purple → Gold para XP, cards com glassmorphism sutil

---

## 🔧 Variáveis de Ambiente (Backend)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/questlog
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
```

---

## 📱 Configuração Expo Go (celular real)

1. Instale o app **Expo Go** no seu celular
2. Certifique-se que o celular e o computador estão na **mesma rede Wi-Fi**
3. No `frontend/utils/api.js`, troque `localhost` pelo IP da sua máquina:
   ```js
   export const API_URL = 'http://192.168.1.X:3000/api';
   ```
4. Rode `npx expo start` e escaneie o QR code

---

## 🛠️ Próximos Passos Sugeridos

- [ ] Push notifications para lembrar de diárias
- [ ] Sistema de grupos / guildas
- [ ] Loja de itens cosméticos com XP
- [ ] Gráficos de progresso semanal/mensal
- [ ] Modo offline com sync posterior
- [ ] Avatares customizáveis com partes
- [ ] Desafios temporários (eventos)
