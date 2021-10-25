import "dotenv/config";
import express from "express";
import http from "http";
import { router } from "./routes";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors())

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: '*'
  }
});

io.on('connection', socket => {
  console.log(`Usuario conectado no socket ${socket.id}`);
  
})
//especifica o tipo da requisicao json
app.use(express.json());

app.use(router);

//rota de autenticacao do usuario
app.get('/github', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
});

//define a rota de callbacl
app.get('/signin/callback', (req, res) => {
  const { code } = req.query;

  return res.json(code);
})
 
export {serverHttp, io }