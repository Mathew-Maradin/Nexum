// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Inventory {
    struct DataSet {
        address payable owner;
        string displayName;
        string FID;
        string description;
        uint256 cost;
        address[] authorizedUsers;
    }

    DataSet[] public sets;
    uint256 public numberOfDataSets = 0;

    event ItemPurchased(address buyer, uint256 amount);

    function createDataSet (address _owner, string memory _displayName, string memory _FID,
    string memory _description, uint256 _cost) public returns (uint256){

        address[] memory users = new address[](1);
        users[0] = _owner;

        sets.push( DataSet({
            owner: payable(_owner),
            displayName: _displayName,
            FID: _FID,
            description: _description,
            cost: _cost,  
            authorizedUsers: users
        }));

        numberOfDataSets++;
        return numberOfDataSets - 1;
    }

    function buyDataSet (uint256 _index) public payable{
        uint256 amount = msg.value;

        DataSet storage set = sets[_index];
        address payable _seller = set.owner;

        _seller.transfer(set.cost);
        emit ItemPurchased(msg.sender, amount);
    }

    function getAuthorizedUsers(uint256 _index) public view returns(address[] memory){
        DataSet storage set = sets[_index];
        return(set.authorizedUsers); 
    }

    function getAllDataSets() public view returns(DataSet[] memory){
        return sets;
    }

    function getDataSet(uint256 _index) public view returns(DataSet memory){
        return(sets[_index]);
    }

    function getPurchasedSets(address _user) public view returns (DataSet[] memory) {
        uint256 userSetCount = 0;
        DataSet[] memory allSets = getAllDataSets();
        DataSet[] memory authorizedSets;

        for (uint256 i = 0; i <= numberOfDataSets; i++) {
            for (uint256 x = 0; x <= allSets[i].authorizedUsers.length; x++) {
                if(_user == allSets[i].authorizedUsers[x]){
                    authorizedSets[userSetCount] = allSets[i];
                    userSetCount++;
                } else {
                    continue;
                }
                
            }
        }
        return authorizedSets;
    }
}


