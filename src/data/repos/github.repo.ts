import { Vla } from 'vla'
import { GitHub } from '../cms'

export class GitHubRepo extends Vla.Repo {
  github = this.inject(GitHub)

  allPosts = this.memo(async () => {
    return this.github.posts.all()
  })

  getPost = this.memo(async (slug: string) => {
    return this.github.posts.get(slug)
  })

  allPages = this.memo(async () => {
    return this.github.pages.all()
  })

  getPage = this.memo(async (slug: string) => {
    return this.github.pages.get(slug)
  })

  allShorts = this.memo(async () => {
    return this.github.shorts.all()
  })

  getShort = this.memo(async (id: string) => {
    return this.github.shorts.get(id)
  })

  allTags = this.memo(async () => {
    return this.github.tags.all()
  })

  getTag = this.memo(async (id: string) => {
    return this.github.tags.get(id)
  })

  getSettings = this.memo(async () => {
    return this.github.settings.get()
  })
}
