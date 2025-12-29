import jwt from "jsonwebtoken";

export const verifyJwt = (token: string) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!)
        return { valid: true, payload }
    } catch (error) {
        return { valid: false, payload: null }
    }
}