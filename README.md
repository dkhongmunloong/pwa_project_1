# pwa_project_1
A project to showcase progressive web app functionalities using javascript and jQuery

1. In this small project, a mini-site for the Fashion Products website is created, as a Progressive Web App (PWA). PWAs are expected to be installable on mobile phones and respond to Push Notifications.
2. The site should have the two following screens:
• Listing
• Details
3. In the PWA/mini-site, retrieve live data by AJAX calls to populate the data into the two pages from the following URL:
http://inec.sg/assignment/retrieve_records.php
An example of the response JSON body
{"last_update":"13-DEC-2024 17:23:29 GMT+0800","products":[{"name":"Gucci Monogrammed Canvas","product_type":"Head Gear","size":"no","warranty":365,"price":899,"image":"https://inec.sg/assignment/images/gucci_cap.png"},{"name":"Versace Barocco Silk Shirt","product_type":"Top","size":"yes","warranty":365,"price":2299,"image":"https://inec.sg/assignment/images/versace_shirt.png"}]}
4. In the Listing screen, populate the results into a list in the following format. Each of the item is clickable to go to the Details screen.
5. In the Details screen, you are to display the item details in the following format. Users can tap on “WHERE TO FIND” button to go to the Map screen.
6. In the Map screen, user can add marker on the map view to store where the product is sold. The location/s of the item is stored permanently using localStorage, so that they can be revisited and serve as a record for users.

