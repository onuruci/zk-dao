// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import { Unirep } from "@unirep/contracts/Unirep.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface IVerifier {
    function verifyProof(
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof
    ) external view returns (bool);
}


contract UnirepApp {
    Unirep public unirep;
    IVerifier internal dataVerifier;

    Post[] public posts;
    uint256 public postCount = 0;

    struct Post {
        uint256 epochKey;
        uint256[5] publicSignals;
        uint256[8] proof;
        string context;
    }

    constructor(Unirep _unirep, IVerifier _dataVerifier, uint48 _epochLength) {
        // set unirep address
        unirep = _unirep;

        // set verifier address
        dataVerifier = _dataVerifier;

        // sign up as an attester
        unirep.attesterSignUp(_epochLength);
    }

    // sign up users in this app
    function userSignUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        unirep.userSignUp(publicSignals, proof);
    }

    function submitManyAttestations(
        uint256 epochKey,
        uint48 targetEpoch,
        uint[] calldata fieldIndices,
        uint[] calldata vals
    ) public {
        require(fieldIndices.length == vals.length, 'arrmismatch');
        for (uint8 x = 0; x < fieldIndices.length; x++) {
            unirep.attest(epochKey, targetEpoch, fieldIndices[x], vals[x]);
        }
    }

    function submitAttestation(
        uint256 epochKey,
        uint48 targetEpoch,
        uint256 fieldIndex,
        uint256 val
    ) public {
        unirep.attest(
            epochKey,
            targetEpoch,
            fieldIndex,
            val
        );
    }

    function newPost (
        uint256 epochKey,
        uint48 currEpoch,
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof,
        string calldata context
    ) public {
        require(verifyDataProof( publicSignals, proof ));

        posts.push(Post(
            epochKey,
            publicSignals,
            proof,
            context
        ));

        postCount++;
    }

    function getPost(uint256 _index) public view returns(Post memory) {
        require(_index < postCount && postCount > 0);
        return posts[_index];
    }

    function getAllPosts() public view returns(Post [] memory) {
        return posts;
    }

    function getPostCount() public view returns(uint256) {
        return postCount;
    }

    function verifyDataProof(
        uint256[5] calldata publicSignals,
        uint256[8] calldata proof
    ) public view returns(bool) {
        return dataVerifier.verifyProof(
            publicSignals,
            proof
        );
    }

}
