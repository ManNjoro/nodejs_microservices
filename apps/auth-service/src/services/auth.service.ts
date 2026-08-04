import { AppError } from "shared";
import { createUser, findByEmail } from "../repositories/user.repo";
import { RegisterInput } from "../schemas/auth.schemas";
import bcrypt from 'bcrypt'
import { convertToPublicUser } from "../utils/auth.utils";

export async function register(input: RegisterInput) {
    const existing = await findByEmail(input.email)

    if(existing) throw new AppError(409, 'Email already registered');

    const passwordHash = await bcrypt.hash(input.password, 10)

    const user = await createUser({
        name: input.name,
        email: input.email,
        passwordHash,
        role: 'USER'
    })

    return convertToPublicUser(user)
}