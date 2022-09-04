import { myDataSource } from "../../config/app-data-source";
import { User } from "./User";

export const UserRepository = myDataSource.getRepository(User);