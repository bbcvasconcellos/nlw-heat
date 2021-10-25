import { Router } from "express";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { UserAuthController } from "./controllers/UserAuthController";
import { EnsureAuth } from "./middleware/EnsureAuth";

const router = Router();

router.post('/auth', new UserAuthController().handle)

router.post('/messages', EnsureAuth, new CreateMessageController().handle)

router.get('/message/last3', new GetLast3MessagesController().handle)

router.get('/profile', EnsureAuth, new ProfileUserController().handle)

export { router }