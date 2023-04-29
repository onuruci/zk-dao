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

// struct Proposal {
//     uint256 id;
//     string title;
//     string description;
//     uint256 minRepToVote;
//     uint256 approvals;
//     uint256 rejects;
//     uint256 abstein;
//     bool isActive;
//     uint256 epochKey;
//     uint48 currEpoch;
//     uint256[5] publicSignals;
//     uint256[8] proof;
// }

export interface I_PROPOSAL {
    id?: number
    title: string
    description: string
    provedReputation: number
    minRepToVote?: number
    approvals?: number
    rejects?: number
    abstein?: number
    isActive?: boolean
    epochKey?: bigint
    currEpoch?: number
    publicSignals?: bigint[]
    proof?: bigint[]
}
