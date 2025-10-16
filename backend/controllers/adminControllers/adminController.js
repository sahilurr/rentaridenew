export const adminAuth = async (req,res,next)=> {
    try{
        if(req.user.isAdmin){
            res.status(200).json({message:"admin loged in successfully"})
        }
        else{
            res.status(403).json({message:"only acces for admins"})
        }
        
    }
    catch(error){
        next(error)
    }
}

export const adminProfiile = async (req,res,next)=> {
    try{

    }
    catch(error){
        next(error)
    }
}

