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

    function createDataSet (address _owner, string memory _title, string memory _description,
     uint256 _cost, string memory _image) public returns (uint256){

        DataSet storage set = sets[numberOfDataSets];

        set.owner = _owner;
        set.title = _title;
        set.descrption = _description;
        set.cost = _cost;
        set.image = _image;

        numberOfDataSets++;
        return numberOfDataSets - 1;
    }

    function buyDataSet (uint256 _id) public payable returns(uint256){
        uint256 amount = msg.value;

        DataSet storage set = sets[_id];

        require(amount != set.cost, "Incorrect amount paid!");

        return numberOfDataSets;
    }

    function getAuthorizedUsers(uint256 _id) public returns(address[] memory){
        DataSet storage set = sets[_id];
        return(set.authorizedUsers);
    }

    function getAllDataSets() public returns(DataSet[] memory){
        DataSet[] memory allSets = new DataSet[](numberOfDataSets);

        for (uint256 i = 1; i <= numberOfDataSets; i++) {
            allSets[i - 1] = sets[i];
        }

        return allSets;
    }

    function getDataSet(uint256 _id) public returns(DataSet){
        DataSet storage set = sets[_id];
        return(set);
    }

    function getPurchasedSets(address _user) public view returns (DataSet[] memory) {
        uint256 userItemCount = 0;

        // Count the number of items the user is authorized to access
        for (uint256 i = 1; i <= numberOfDataSets; i++) {
            if (isUserAuthorizedForItem(_user, sets[i])) {
                userItemCount++;
            }
        }

        DataSet[] memory userSets = new Item[](userItemCount);
        uint256 userItemIndex = 0;

        // Retrieve the items the user is authorized to access
        for (uint256 i = 1; i <= itemCount; i++) {
            if (isUserAuthorizedForItem(_user, sets[i])) {
                userSets[userItemIndex] = sets[i];
                userItemIndex++;
            }
        }

        return userItems;
    }
}
