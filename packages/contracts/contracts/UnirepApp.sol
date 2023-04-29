// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {Unirep} from '@unirep/contracts/Unirep.sol';

// Uncomment this line to use console.log
import 'hardhat/console.sol';

interface IVerifier {
    function verifyProof(
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof
    ) external view returns (bool);
}

contract ZKComm {
    Unirep public unirep;
    IVerifier internal dataVerifier;

    Post[] public posts;
    uint256 public postCount = 0;

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

    event NewPost();
    event UpVote(uint256 _index, uint256 _atstVal);

    constructor(Unirep _unirep, IVerifier _dataVerifier, uint48 _epochLength) {
        unirep = _unirep;

        dataVerifier = _dataVerifier;

        unirep.attesterSignUp(_epochLength);
    }

    // sign up users in this app
    function userSignUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        unirep.userSignUp(publicSignals, proof);
    }

    function upVote(uint256 index) public {
        uint256 atstVal = 10;

        unirep.attest(posts[index].epochKey, posts[index].postEpoch, 0, atstVal);
        posts[index].upVotes++;
        emit UpVote(index, atstVal);
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

    function verifyDataProof(
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof
    ) public view returns (bool) {
        return dataVerifier.verifyProof(publicSignals, proof);
    }
}
