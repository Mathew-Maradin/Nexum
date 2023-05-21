// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Inventory {
    struct DataSet {
        address payable owner;
        string displayName;
        string FID;
        string description;
        uint256 cost;
        string image;
        address[] authorizedUsers;
    }

    mapping(uint256 => DataSet) public sets;
    uint256 public numberOfDataSets = 0;

    event ItemPurchased(address buyer, uint256 amount);

    function createDataSet (address _owner, string memory _displayName, string memory _FID,
    string memory _description, uint256 _cost, string memory _image) public returns (uint256){
        DataSet storage set = sets[numberOfDataSets];

        set.owner = payable(_owner);
        set.displayName = _displayName;
        set.FID = _FID;
        set.description = _description;
        set.cost = _cost;
        set.image = _image;

        numberOfDataSets++;
        return numberOfDataSets - 1;
    }

    function buyDataSet (string memory _FID) public payable{
        uint256 amount = msg.value;

        for (uint256 i = 1; i <= numberOfDataSets; i++) {
            if (keccak256(bytes(_FID)) == keccak256(bytes(sets[i].FID))) {
                DataSet storage set = sets[i];
                
                address payable _seller = set.owner;

                require(amount == set.cost, "Incorrect amount paid!");

                _seller.transfer(msg.value);
                emit ItemPurchased(msg.sender, msg.value);
            }
        }
    }

    function getAuthorizedUsers(string memory _FID) public view returns(address[] memory){
        for (uint256 i = 1; i <= numberOfDataSets; i++) {
            if (keccak256(bytes(_FID)) == keccak256(bytes(sets[i].FID))) {
                DataSet storage set = sets[i];
                return(set.authorizedUsers);
            }
        }
        revert("Dataset not found");
    }

    function getAllDataSets() public view returns(DataSet[] memory){
        DataSet[] memory allSets = new DataSet[](numberOfDataSets);

        for (uint256 i = 1; i <= numberOfDataSets; i++) {
            allSets[i - 1] = sets[i];
        }

        return allSets;
    }

    function getDataSet(string memory _FID) public view returns(DataSet memory){
        for (uint256 i = 1; i <= numberOfDataSets; i++) {
            if (keccak256(bytes(_FID)) == keccak256(bytes(sets[i].FID))) {
                DataSet storage set = sets[i];
                return(set);
            }
        }

        revert("Dataset not found");
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


