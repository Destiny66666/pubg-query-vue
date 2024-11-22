import request from "@/util/request.js";
import formatFormData from "@/util/formatFormData.js";

export const getTouristArticleListData = (data) => {
    const formData = formatFormData(data)
    return request.post('/touristArticleList', formData)
}

export const getTouristArticleListsData = (data) => {
    const formData = formatFormData(data)
    return request.post('/touristArticleLists', formData)
}

export const getCategoryListData = () => {
    return request.post('/getCategoryList')
}

export const getArticleData = (id) => {
    return request.post(`/article?id=${id}`)
}
