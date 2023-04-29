// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {Unirep} from '@unirep/contracts/Unirep.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
import 'hardhat/console.sol';

interface IVerifier {
    function verifyProof(
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof
    ) external view returns (bool);
}

contract ZKComm is ERC20 {
    Unirep public unirep;
    IVerifier internal dataVerifier;

    Post[] public posts;
    Proposal[] public proposals;
    uint256 public postCount = 0;
    uint256 public proposalCount = 0;

    mapping(uint256 => mapping(uint256 => bool)) usedKeysPerProposal;

    struct Post {
        uint256 epochKey;
        uint48 postEpoch;
        uint256[5] publicSignals;
        uint256[8] proof;
        string title;
        string description;
        uint256 upVotes;
        uint256 downVotes;
    }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 tokenDemands;
        uint256 minRepToVote;
        uint256 approvals;
        uint256 rejects;
        uint256 abstein;
        bool isActive;
        uint256 epochKey;
        uint48 currEpoch;
        uint256[5] publicSignals;
        uint256[8] proof;
    }

    event NewPost();
    event NewProposal();
    event UpVote(uint256 _index, uint256 _atstVal);
    event ProposalVote(uint256 _index, uint256 _vote);

    constructor(Unirep _unirep, IVerifier _dataVerifier, uint48 _epochLength) ERC20("Reputation", "REP") {
        unirep = _unirep;

        dataVerifier = _dataVerifier;

        unirep.attesterSignUp(_epochLength);

        _mint(address(this), 100000 * 10 ** 18);
    }

    // sign up users in this app
    function userSignUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        unirep.userSignUp(publicSignals, proof);
    }

    function newProposal(
        string memory title,
        string memory description,
        uint256 minRepToVote,
        uint256 epochKey,
        uint48 currEpoch,
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof
    ) public {
        // publish proposal with proving your reputation
        require(verifyDataProof(publicSignals, proof));

        // get epoch key epoch number and check if post in current epoch and generate it

        proposals.push(Proposal(
            proposalCount,
            title,
            description,
            1000,
            minRepToVote,
            0,
            0,
            0,
            true,
            epochKey,
            currEpoch,
            publicSignals,
            proof
        ));

        proposalCount++;

        emit NewProposal();
    }

    function voteProposal(
        uint256 _index,
        uint256 _vote,
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof
    ) public {
        require(_vote >= 0 && _vote <= 2);
        require(_index < proposalCount && proposalCount > 0);
        require(verifyDataProof(publicSignals, proof));
        require(publicSignals[0] >= proposals[_index].minRepToVote);

        // get epoch key and label it as used to prevent duplicate voting

        if(_vote == 0) {
            // reject
            proposals[_index].rejects++;
        } else if(_vote == 1) {
            // approve
            proposals[_index].approvals++;
        } else if(_vote == 2) {
            // abstein
            proposals[_index].abstein++;
        }

        emit ProposalVote(_index, _vote);
    }

    function closeProposal(
        uint256 _index
    ) public {
        proposals[_index].isActive = false;

        if(proposals[_index].approvals > proposals[_index].rejects) {
            unirep.attest(proposals[_index].epochKey, proposals[_index].currEpoch, 1, proposals[_index].tokenDemands);
        }
    }

    function spendTokens(
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof,
        address toSend
    ) public {
        require(verifyDataProof(publicSignals, proof));
        transfer(toSend, publicSignals[2]);
    }

    function newPost(
        uint256 epochKey,
        uint48 currEpoch,
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof,
        string calldata title,
        string calldata description
    ) public {
        require(verifyDataProof(publicSignals, proof));
        posts.push(
            Post(
                epochKey,
                currEpoch,
                publicSignals,
                proof,
                title,
                description,
                0,
                0
            )
        );

        postCount++;

        emit NewPost();
    }

    function upVote(uint256 index) public {
        uint256 atstVal = 100;

        unirep.attest(posts[index].epochKey, posts[index].postEpoch, 0, atstVal);

        posts[index].upVotes++;
        emit UpVote(index, atstVal);
    }

    function getPost(uint256 _index) public view returns (Post memory) {
        require(_index < postCount && postCount > 0);
        return posts[_index];
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getPostCount() public view returns (uint256) {
        return postCount;
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCount;
    }

    function verifyDataProof(
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof
    ) public view returns (bool) {
        return dataVerifier.verifyProof(publicSignals, proof);
    }
}

// Vote on proposals

// End proposal functionality

// Use replecable fields

// Spend erc20 based on these replecable field values
// Users should be sending requests at the same epoch to spend erc20