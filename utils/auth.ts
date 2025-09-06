import jwt, { JwtPayload } from "jsonwebtoken";

export function verifyAuthToken(token?: string) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return decoded;
  } catch {
    return null;
  }
}
