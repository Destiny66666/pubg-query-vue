import request from "@/util/request.js";
import formatFormData from "@/util/formatFormData.js";

export const getPubgUserPlayer = (data)=>{
    const formData = formatFormData(data)
    return request.post('/pubg/getPubgUserPlayer', formData)
}

export const getPubgSeasons=()=>{
    return request.get('/pubg/getPubgSeasons')
}

export const getPubgSeasonsRankedData=(data)=>{
    const formData = formatFormData(data)
    return request.post('/pubg/getPubgSeasonsRanked', formData)
}

export const getPubgSeasonsData=(data)=>{
    const formData = formatFormData(data)
    return request.post('/pubg/getPubgSeasonsData', formData)
}

export const getPubgMatchesData=(data)=>{
    return request.post('/pubg/getPubgMatches',{"platform":data.platform,"accountId":data.accountId,"page":data.page,"matches":data.matches})
}

export const getWeaponMasteryData=(data)=>{
    const formData = formatFormData(data)
    return request.post('/pubg/getWeaponMastery', formData)
}

export const getLifeTimeData=(data)=>{
    const formData = formatFormData(data)
    return request.post('/pubg/getLifeTime', formData)
}
export const getLeaderBoardData = (data)=>{
    const formData = formatFormData(data)
    return request.post('/pubg/getLeaderBoard', formData)
}

export const getHistoryQueryData=()=>{
    return request.get('/pubg/getHistoryQuery')
}

export const getPubgOnlineData=()=>{
    return request.get('/pubg/getPubgOnline')
}

export const getSteamVacData = (data)=>{
    const formData = formatFormData(data)
    return request.post('/pubg/getSteamVac', formData)
}