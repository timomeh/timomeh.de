import { Vla } from 'vla'
import { GitHubRepo } from '../github.repo'
import { PostsRepo } from '../posts/posts.repo'
import { TagsRepo } from '../tags/tags.repo'
import { PostTagsRepo } from './postTags.repo'

export class PostTagsCache extends Vla.Service {
  postsRepo = this.inject(PostsRepo)
  tagsRepo = this.inject(TagsRepo)
  postTagsRepo = this.inject(PostTagsRepo)
  githubRepo = this.inject(GitHubRepo)

  async cacheAll() {
    const posts = await this.githubRepo.allPosts()
    const dbPosts = await this.postsRepo.all()
    const dbTags = await this.tagsRepo.all()

    const tagsMap = Object.fromEntries(dbTags.map((tag) => [tag.slug, tag]))
    const postsMap = Object.fromEntries(
      dbPosts.map((post) => [post.slug, post]),
    )

    const postTags = posts.flatMap((post) =>
      post.tags.map((tag) => ({
        postId: postsMap[post.slug].id,
        tagId: tagsMap[tag].id,
      })),
    )

    await this.postTagsRepo.deleteAll()
    await this.postTagsRepo.insertMany(postTags)
  }

  async updateByPost(slug: string) {
    const post = await this.githubRepo.getPost(slug)
    const dbPost = await this.postsRepo.bySlug(slug)

    if (post && dbPost) {
      const tags = await this.tagsRepo.findManyBySlugs(post.tags)
      const postTags = tags.map((tag) => ({
        postId: dbPost.id,
        tagId: tag.id,
      }))

      await this.postTagsRepo.deleteByPost(dbPost.id)
      await this.postTagsRepo.insertMany(postTags)
    }
  }
}
