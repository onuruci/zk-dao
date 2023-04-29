export interface I_COMMENT {
    commentOwner: bigint
    context: string
    upvote: number
    downvote: number
    to: I_POST
}

export interface I_POST {
    description: string
    epochKey?: bigint
    upVotes?: number
    downVotes?: number
    comments?: Comment
    provedReputation: number
    title: string
    publicSignals?: bigint[]
    postEpoch?: number
    proof?: bigint[]
}
