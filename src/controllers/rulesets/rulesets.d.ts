interface CreateRulesetResponse {
    valid: boolean
    message?: string
    url?: string
}

interface Ruleset {
    id: number
    title: string
    background_image_url: string | null
    created_at: string
    description: string
    game: string
    slug: string
}

export{CreateRulesetResponse, Ruleset}
