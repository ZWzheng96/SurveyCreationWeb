import { Request } from 'express';

export function UserDisplayName(req: Request){
    if (req.user){
        let user = req.user as UserDocument;
        return user.displayName.toString();
    }
}