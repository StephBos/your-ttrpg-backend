import { query } from '../../config/database.js'
import { getUserByUsername } from '../users/usersControllers.js'
import type { CreateRulesetResponse } from './rulesets.js'

async function createRuleset(
   username: string,
   title: string,
   backgroundImageUrl: string | null,
   description: string,
   game: string,
   createdAt: string,
   url: string
): Promise<CreateRulesetResponse> {
   console.info('Creating ruleset with title: ', title, ' for user: ', username)
   const user = await getUserByUsername(username)
   if (!user) {
      console.error('User does not exist: ', username)
      return { valid: false, message: 'User does not exist' }
   }

   const validateUrl = await checkUrl(url, user.id)
   if (validateUrl) {
      return { valid: false, message: 'Ruleset URL already exists' }
   }
   
   try {
      await query(
         'INSERT into rulesets (user_id, title, description, game, created_at, background_image_url, url) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7) ',
         [user.id, title, description, game, createdAt, backgroundImageUrl, url]
      )

      return { valid: true, url: url }
   } catch (error) {
      console.error('Error creating user:', username, ' error: ', error)
      throw error
   }
}

async function checkUrl(url: string, userId: number): Promise<boolean> {
   const check = await query(
      'SELECT * FROM rulesets WHERE url = $1 and user_id = $2',
      [url, userId]
   )
   return (check.rowCount ?? 0) > 0
}

export { createRuleset }
