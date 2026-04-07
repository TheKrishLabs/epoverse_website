import { privateApi, publicApi } from "@/lib/axios"

export const getProfileDetails= async ()=>{
    const detailsRes=await privateApi.get('users/profile')
    return detailsRes.data
}

export const updateProfileDetails= async (updatedUser: any)=>{
    try {
        const res= await privateApi.put('users/profile', updatedUser)
        return res.data
    } catch (err) {
        console.error(err)
        throw err  
    } 
}