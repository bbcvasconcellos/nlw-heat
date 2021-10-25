/**
 * Recebe o code
 * verifica se o usuario existe 
 * Se SIM = gera um token
 * Se NAO = cria um novo usuario no banco de dados e depois gera um token
 */

import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";
 
interface AccessTokenResponse{
  access_token: string;
}

interface UserResponse {
  avatar_url: string,
  login: string,
  id: number,
  name: string
}

class UserAuthService {
  async execute(code: string) {
    //url para acessar o access token
    const url = "https://github.com/login/oauth/access_token";

    //renomeia data com o nome de accessTokenResponse
    const { data: accessTokenResponse } = await axios.post<AccessTokenResponse>(url, null, {
      //parametros para acesso ao token
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      headers: {
        "Accept": "application/json"
      }
    });

    //pega todas informacoes do usuario logado
    const response = await axios.get<UserResponse>('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`,
      }
    });

    const { login, id, avatar_url, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      },
    })
    //se o usuario nao existe, cria um novo usuario
    if(!user){
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name
        }
      })
    }

    const token = sign({
      user: {
        name: user.name,
        avatar_url: user.avatar_url,
        id: user.id
      }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    )

    return { token, user };
  }
}

export { UserAuthService }