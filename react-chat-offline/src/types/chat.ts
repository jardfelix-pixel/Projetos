export type MessageAuthor = 'user' | 'robot'

export type ChatMessage = {
  id: string
  author: MessageAuthor
  content: string
  createdAt: number
}
