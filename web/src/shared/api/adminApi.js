import axiosClient from './axiosClient'

export const getAllUsers = () => axiosClient.get('/admin/users')
export const deleteUser = (id) => axiosClient.delete(`/admin/users/${id}`)
export const getAllArticlesAdmin = () => axiosClient.get('/admin/article')
export const deleteArticleAdmin = (id) => axiosClient.delete(`/admin/article/${id}`)