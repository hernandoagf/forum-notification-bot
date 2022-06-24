import { authAxios } from './config'

export const postReply = async (topic_id: number, raw: string) =>
  await authAxios?.post('/posts.json', {
    topic_id,
    raw,
  })

export const editReply = async (post_id: number, raw: string) =>
  await authAxios?.put(`/posts/${post_id}.json`, {
    edit_reason: 'Impact tag changed',
    raw,
  })
