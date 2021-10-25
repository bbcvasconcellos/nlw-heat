//middleware: valida a autenticacao antes de chamar o controller atraves da validacao do token

import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Payload{
  sub: string
}

/*a funcao abaixo vai fazer a validacao. 
Caso o token esteja valido: next chama o controller
Caso o token nao esteja validado: retorna um erro
*/
export function EnsureAuth(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if(!authToken) {
    return res.status(401).json({
      errorCode: "token.invalid",
    });
  }

  const [, token] = authToken.split(" ");
  try{
    const { sub } = verify(token, process.env.JWT_SECRET) as Payload

    req.user_id = sub;

    return next;
  }
  catch(err){
    return res.status(401).json({ errorCode: "token.expired" });
  }
  
}
