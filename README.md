# GEO-crud API - README

Thank you for using the GEO-crud API! This README file will guide you through the process of setting up and running the GEO-crud project API on your local machine.

# Prerequisites

Before you start, make sure you have the following installed on your machine:

1. Node.js (https://nodejs.org/) - Make sure to install the LTS version.
2. npm (Node Package Manager) - This comes bundled with Node.js.
3. MongoDB (https://www.mongodb.com/try/download/community) - Install the Community Edition.

# Getting Started

1.  Clone the repository:

        git clone https://github.com/JenishChanchad98/geo-crud-api.git
        cd geo-crud-api

2.  Install dependencies:

        npm install

3.  Configure and create a .ENV file in the root of the project to store environment variables. this file should contain the following variables::

    - MONGO_URI=
    - PORT=
    - JWT_SECRET_KEY=
    - SALT_ROUNDS=
    - JWT_EXPIRATION_TIME=

4.  Start the server:

        npm run dev

    The API should now be up and running at

        http://localhost:3000
