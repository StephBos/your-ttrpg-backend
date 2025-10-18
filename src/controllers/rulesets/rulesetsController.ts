import { query } from '../../config/database.js'
import { getUserByUsername } from '../users/usersControllers.js'

async function createRuleset(
   username: string,
   title: string,
   backgroundImageUrl: string | null,
   description: string,
   game: string,
   createdAt: string
): Promise<any> {
   console.info('Creating ruleset with title: ', title, ' for user: ', username)
   const user = await getUserByUsername(username)
   if (!user) {
      console.error('User does not exist: ', username)
      return null
   }

   try {
      const result = await query(
         'INSERT into rulesets (user_id, title, description, game, created_at, background_image_url) ' +
            'VALUES ($1, $2, $3, $4, $5, $6) ',
         [user.id, title, description, game, createdAt, backgroundImageUrl]
      )
      return result.rows[0]
   } catch (error) {
      console.error('Error creating user:', username, ' error: ', error)
      throw error
   }
}

export { createRuleset }
