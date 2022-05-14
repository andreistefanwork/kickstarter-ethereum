pragma solidity ^0.8.13;

contract CampaignFactory {
    address[] public deployedContracts;

    function createCampaign(uint min) external {
        address campaign = address(new Campaign(min, msg.sender));
        deployedContracts.push(campaign);
    }

    function getDeployedCampaigns() external view returns (address[] memory) {
        return deployedContracts;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;

    mapping(address => bool) public approvers;
    uint public approversCount;

    mapping(uint => Request) public requests;
    uint private requestCount;

    modifier meetsMinimumContribution() {
        require(msg.value >= minimumContribution);
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    modifier onlyApprovers() {
        require(approvers[msg.sender]);
        _;
    }

    modifier hasNotVotedYet(uint index) {
        require(!requests[index].approvals[msg.sender]);
        _;
    }

    modifier hasMajorityVote(uint index) {
        require(requests[index].approvalCount > approversCount / 2);
        _;
    }

    modifier notCompletedRequest(uint index) {
        require(!requests[index].complete);
        _;
    }

    constructor(uint min, address campaignManager) {
        manager = campaignManager;
        minimumContribution = min;
    }

    function contribute() external payable meetsMinimumContribution {
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) external onlyManager {
        Request storage newRequest = requests[requestCount++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
    }

    function approveRequest(uint index) external onlyApprovers hasNotVotedYet(index) {
        Request storage request = requests[index];
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) external payable onlyManager hasMajorityVote(index) notCompletedRequest(index) {
        Request storage request = requests[index];

        request.recipient.transfer(request.value);

        request.complete = true;
    }
}
