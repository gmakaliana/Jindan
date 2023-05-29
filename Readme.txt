Distributed Database Systems Project [Jindan]

1. Cluster Setup

1.1 Pre-Installation Requirements
    
    - Host machine with minimum 4GB memory and more than 10GB free disk space.
    - Docker (Ubuntu) or Docker Desktop (Windows) installed on your host machine.
    - Docker compose 
    - Windows Powershell (for Windows OS)

2. Network Setup
   - docker network create jindan-net

2.1 Cluster Configuration
    - docker-compose file

2.2 Spinning the Cluster Nodes
    - docker-compose up -d
    
    - Configuring the number of worker nodes
      - docker-compose -p jindan up --scale worker=3

2.3 Verification
    - docker ps 

3.1 Getting into master node
    - docker exec -it jindan_master psql -U postgres -d postgres
    - \l ( display all databases )
    - \c "nameofdatabase" ( connect to database )

      Basic SQL queries:

    - select * from facility;
    - INSERT INTO Facility (FacilityName, Location, PhoneNumber, EmailAddress) VALUES ('Paray Hospital', 'Thaba-Tseka', 58221345, 'info@stmaryshospital.com');
    - DELETE from facility WHERE facilityid = 1;
    - UPDATE facility SET facilityname = 'jake', emailaddress = 'jake@mail.com' WHERE facilityid = 1;

    - \dt ( display all tables in a selected database )
    - \q ( quit from a database )

4.1 Create Tables Queries on "postgres" database

    CREATE TABLE Facility (
       FacilityID SERIAL PRIMARY KEY,
       FacilityName VARCHAR(50),
       Location VARCHAR(50),
       PhoneNumber VARCHAR(15),
       EmailAddress VARCHAR(100)
    );

// Distribute facility table to worker nodes 
select create_distributed_table('facility','facilityid');

// insert into facility table with sample data
INSERT INTO Facility (FacilityName, Location, PhoneNumber, EmailAddress) VALUES ('Paray Hospital', 'Thaba-Tseka', 58221345, 'info@stmaryshospital.com');
INSERT INTO Facility (FacilityName, Location, PhoneNumber, EmailAddress) VALUES ('Maluti Hospital', 'Berea', 58229900, 'info@malutihospital.com');

CREATE TABLE Patient (
  PatientID SERIAL,
  PatientName VARCHAR(50),
  Gender VARCHAR(50),
  PhoneNumber VARCHAR(50),
  DateTransfused VARCHAR(50),
  QuantityTransfused VARCHAR(50),
  FacilityID INT,
  PRIMARY KEY (PatientID, FacilityID),
  FOREIGN KEY (FacilityID) REFERENCES Facility(FacilityID)
);

-- Distribute the Patient table
SELECT create_distributed_table('patient', 'facilityid');

-- Insert sample data into the Patient table
INSERT INTO Patient (PatientName, Gender, PhoneNumber, DateTransfused, QuantityTransfused, FacilityID)
VALUES ('Emily Davis', 'Female', '67895444', '2023-05-02', '300', 2),
       ('Robert Wilson', 'Male', '59564432', '2023-05-06', '200', 1),
       ('Sarah Thompson', 'Female', '57908878', '2023-05-12', '350', 2);


CREATE TABLE BloodRequest (
  RequestID SERIAL,
  BloodQuantity VARCHAR(50),
  Status VARCHAR(50),
  BloodType VARCHAR(50),
  FacilityID INT,
  PRIMARY KEY (RequestID, FacilityID),
  FOREIGN KEY (FacilityID) REFERENCES Facility(FacilityID)
);

-- Distribute the BloodRequest table
SELECT create_distributed_table('bloodrequest', 'facilityid');

-- Insert sample data into the BloodRequest table
INSERT INTO BloodRequest (BloodQuantity, Status, BloodType, FacilityID)
VALUES ('400', 'Pending', 'O', 1),
       ('250', 'Completed', 'A', 2),
       ('500', 'Pending', 'B', 1);


CREATE TABLE BloodInventory (
  BloodInventoryID SERIAL,
  BloodType VARCHAR(50),
  BloodQuantity VARCHAR(50),
  ExpiryDate VARCHAR(50),
  facilityid INT,
  PRIMARY KEY (BloodInventoryID, facilityid),
  FOREIGN KEY (facilityid) REFERENCES facility(facilityid)
);

-- Distribute the BloodInventory table
SELECT create_distributed_table('BloodInventory', 'facilityid');

-- Insert sample data into the BloodInventory table
INSERT INTO BloodInventory (BloodType, BloodQuantity, ExpiryDate, facilityid)
VALUES ('O', '1000', '2023-06-01', 1),
       ('A', '500', '2023-07-15', 2),
       ('B', '750', '2023-06-30', 1);


CREATE TABLE BloodDonor (
  DonorID SERIAL,
  DonorName VARCHAR(50),
  PhoneNumber VARCHAR(15),
  QuantityDonated VARCHAR(50),
  Date VARCHAR(50),
  FacilityID INT,
  PRIMARY KEY (DonorID, FacilityID),
  FOREIGN KEY (FacilityID) REFERENCES Facility(FacilityID)
);

-- Distribute the blooddonor table
SELECT create_distributed_table('blooddonor', 'facilityid');

-- Insert sample data into the BloodDonor table
INSERT INTO BloodDonor (DonorName, PhoneNumber, QuantityDonated, Date, FacilityID)
VALUES ('John Doe', '56789110', '500', '2023-05-01', 1),
       ('Jane Smith', '65432130', '250', '2023-05-05', 2),
       ('Michael Johnson', '55456789', '400', '2023-05-10', 1);

5.1 Getting into worker nodes

    - docker exec -it jindan-worker-1 psql -U postgres -d postgres
    - docker exec -it jindan-worker-2 psql -U postgres -d postgres
    - docker exec -it jindan-worker-3 psql -U postgres -d postgres

6.1 Setup web app on master that ingests data from distributed DB

    Requirements:
   
       - Update your repository
       - Install sudo
       - Install nano
       - Install curl
       - Install nodejs ( 606 MB ) 16 or higher
       - setup nodejs and create server
       - setup react and create basic app
       - Test installation

7.1 Connection files
    - facility_model.js
    - index.js 
  
7.2 Creating an API server with Node.js and Express
    
    - Create a new directory and set a new npm package from your terminal with the following commands.
    - mkdir node-postgres 
    - cd node-postgres
    - npm init

    - You can fill in your package information as you like, but here is an example of my package.json:

     {
  	"name": "node-postgres",
  	"version": "1.0.0",
  	"description": "Learn how NodeJS and Express can interact with PostgreSQL",
  	"main": "index.js",
  	"license": "ISC"
      }

     - Next, install the required packages with the following command:
           npm i express pg
     - Once both are installed, create an " index.js " file with the same content as the one provided with this package in "index.js" file.
     - Open your terminal in the same directory and run "node index.js" when in "node-postgres" folder.
       Your Node application will run on port 3002, so open your browser and navigate to http://localhost:3002.
       You’ll see “the contents of facility table” displayed in your browser.
 
       You now have everything you need to write your API.

     - Making NodeJS talk with Postgres

     - Create a new file named "facility_model.js" and input the same code as 
       the one provided in the same file provided with this package in "facility_model.js" file. 


8.1 UI files
    - App.js
    - index2.js

8.2 Creating your React application

    - Let’s bootstrap your React app with the " create-react-app " command.
            npx create-react-app react-postgres
  
    - In your React app directory, you can remove everything inside the src/ directory.

      - Now let’s write a simple React app from scratch.

      - First, create an "App.js" file with the same content as provided with the package in "App.js" file.

    - Finally, create an "index.js" file with the same content as "index2.js" file provided with this package and render the App component.
    - Now run your React app with " npm start " when in "react-postgres" folder. 
      You can test and see how the data collected from your React application is recorded into PostgreSQL.

9.1 Getting started with Postgres in your React app ( below is the link )

    https://blog.logrocket.com/getting-started-with-postgres-in-your-react-app/

10.1 The html files that build our planned App UI are also provided.

     - login.html  ( You can first open this file using web browser to see how our App UI looks like)
     - hospital.html
     - bloodbank.html
     - searchblood.html
     - updateblood.html
     - updatebloodbank.html






       



















    
   
