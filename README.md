# Name sorter UI



## <u>What?</u>

Name Sorter is an user interface to display names and amounts. This Application can be used to monitor most common names of people.

This application can be seen in action here: https://www.namesorter.matiaslang.info

------



## <u>How does it work?</u>

Name sorter has an API running on different service, which access data in DynamoDB and provides it as a list to user interface. More specific information about backend service can be found here: [NameService](https://github.com/matiaslang/NameService)

If you wan't to run this service, you can clone it and run it using these commands:

```
cd /directory/of/namesorter
npm i
npm start
```

When you first start the application, you can see some dummy values introduced. When you press the button labeled "Fetch names from db" the UI will process a request to backend and update values accordingly.



------



## <u>What still needs to be done?</u>

#### Fixes:

TODO: Fetch names from DB button does not update the view after the initial update. This needs to be fixed.

#### Updates:

TODO: API provides "put" -functionality, so we can update a single entry from database. This needs to be implemented.

TODO: Add option to send whole namelist through UI. Currently this is done through API request using postman

TODO: UI Fixes. Amount column can be moved to right side of view, and there can be some margin / padding added on the sides

TODO: Add tests...
