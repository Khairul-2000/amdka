import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export const comparePassword = (password, hash)=>{
    return bcrypt.compare(password, hash);
}


export const hashPassword = (password)=>{
    return bcrypt.hash(password, 5)

}


export const createJWT = (user)=>{

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign({
        id: user.id, 
        email: user.email
    }, 

    jwtSecret as string, {expiresIn: "25days"})

    return token;
}


export const protect = (req, res, next)=>{
    const bearer = req.headers.authorization;

    if(!bearer){
        res.status(401)
        res.json({message: "not authorized"})
        return
    }

    const [, token] = bearer.split(' ');

    if(!token){
        console.log(token)
        res.status(401)
        res.json({message: "not valid token from token"})
        return
    }

    try{

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const user = jwt.verify(token, jwtSecret as string);
        req.user = user;
        console.log(user);
        next();

    }catch(e){
        console.log(token)
        console.log("from error part")
        res.status(401)
        res.json({message: "not valid token from error"})

    }
}