export interface I_COMMENT {
    commentOwner: bigint
    context: string
    upvote: number
    downvote: number
    to: I_POST
}

export interface I_POST {
    context: string
    postOwner?: bigint
    upvote?: number
    downvote?: number
    comments?: Comment
    provedReputation: number
}
