import axiosClient from './axiosClient'

export const getAllArticles = () => axiosClient.get('/article')
export const getArticleById = (id) => axiosClient.get(`/article/${id}`)
export const getMyArticles = (userId) => axiosClient.get(`/article/user/${userId}`)
export const createArticle = (data) => axiosClient.post('/article', data)
export const updateArticle = (id, data) => axiosClient.put(`/article/${id}`, data)
export const deleteArticle = (id) => axiosClient.delete(`/article/${id}`)
export const likeArticle = (id) => axiosClient.post(`/article/${id}/like`)
export const unlikeArticle = (id) => axiosClient.delete(`/article/${id}/like`)
export const addComment = (id, content) =>
  axiosClient.post(`/article/${id}/comments`, { content })
export const deleteComment = (commentId) =>
  axiosClient.delete(`/comments/${commentId}`)
export const getMyActivity = (userId) => axiosClient.get(`/users/${userId}/activity`)