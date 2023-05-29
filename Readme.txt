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

2.3 Verication
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

    - \dt ( display all tables in a selected )
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

    // Requirements
   
       - Update your repository
       - Install sudo
       - Install nano
       - Install curl
       - Install nodejs ( 606 MB ) 16 or higher
       - setup nodejs and create server
       - setup react and create basic app
       - Test installation

7.1 Connection


       



















    
   
