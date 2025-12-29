import { Vla } from 'vla'
import { log as baseLog } from '@/lib/log'
import { GitHubRepo } from '../repos/github.repo'
import { PostsRepo } from '../repos/posts.repo'

const log = baseLog.child().withContext({ module: 'data/posts' })

export class PostsCache extends Vla.Service {
  githubRepo = this.inject(GitHubRepo)
  postsRepo = this.inject(PostsRepo)

  async cacheAll() {
    const posts = await this.githubRepo.allPosts()
    await this.postsRepo.deleteAll()
    await this.postsRepo.insertMany(posts)
  }

  async update(slug: string) {
    const post = await this.githubRepo.getPost(slug)
    const storedPost = await this.postsRepo.bySlug(slug)

    if (!post && storedPost) {
      log.withMetadata({ slug }).info('Removing record')
      await this.postsRepo.delete(storedPost.id)
    }

    if (post) {
      log.withMetadata({ slug }).info('Saving record')
      await this.postsRepo.upsertBySlug(post)
    }
  }
}
