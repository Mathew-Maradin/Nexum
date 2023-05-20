// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Inventory {
    struct DataSet {
        address payable owner;
        string displayName;
        string formattedName;
        string jackalPath;
        string descrption;
        uint256 cost;
        string image;
        address[] authorizedUsers;
    }

    mapping(uint256 => DataSet) public sets;
    uint256 public numberOfDataSets = 0;

    event ItemPurchased(uint256 itemId, string itemName, uint256 itemPrice);

    function createDataSet (address _owner, string memory _displayName, string memory _formattedName,
    string memory _description, uint256 _cost, string memory _image) public returns (uint256){
        DataSet storage set = sets[numberOfDataSets];

        set.owner = payable(_owner);
        set.displayName = _displayName;
        set.formattedName = _formattedName;
        set.jackalPath = string(abi.encodePacked(_owner, "/", _formattedName));
        set.descrption = _description;
        set.cost = _cost;
        set.image = _image;

        numberOfDataSets++;
        return numberOfDataSets - 1;
    }

    function buyDataSet (uint256 _id) public payable{
        uint256 amount = msg.value;

        DataSet storage set = sets[_id];
        address payable _seller = set.owner;

        require(amount == set.cost, "Incorrect amount paid!");

        _seller.transfer(msg.value);
    }

    function getAuthorizedUsers(uint256 _id) public view returns(address[] memory){
        DataSet storage set = sets[_id];
        return(set.authorizedUsers);
    }

    function getAllDataSets() public view returns(DataSet[] memory){
        DataSet[] memory allSets = new DataSet[](numberOfDataSets);

        for (uint256 i = 1; i <= numberOfDataSets; i++) {
            allSets[i - 1] = sets[i];
        }

        return allSets;
    }

    function getDataSet(uint256 _id) public view returns(DataSet memory){
        DataSet storage set = sets[_id];
        return(set);
    }

    function getPurchasedSets(address _user) public view returns (DataSet[] memory) {
        uint256 userItemCount = 0;

        DataSet[] memory allSets = getAllDataSets();
        DataSet[] memory authorizedSets;

        for (uint256 i = 1; i <= numberOfDataSets; i++) {
            for (uint256 x = 1; x <= allSets[i].authorizedUsers.length; x++) {
                if(_user == allSets[i].authorizedUsers[x]){
                    authorizedSets[userItemCount] = allSets[i];
                    userItemCount++;
                } else {
                    continue;
                }
                
            }
        }
        return authorizedSets;
    }
}

