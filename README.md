## Overview
EasyEscrow is a web application that converts written PDF Escrow Agreements to XRPL Smart Contracts using natural language processing, simplifying the creation of cryptocurrency-based escrow agreements.

## Installation and dependencies
To run the application locally, you will need Docker and Docker Compose installed on your computer. If you don't have these already installed, I recommend installing Docker Desktop, which includes both Docker and Docker Compose.

Install Docker Desktop: https://docs.docker.com/get-docker/

## Environtment requirements
For the local server to run there is a single variables you need to set. You need to have an OpanAI account and API Key. 

To get an OpenAI API Key visit: https://openai.com/blog/openai-api/

The easiest way to do this is to create a file in the main directory of this repository called `.env`

The contents of this file should look like this
```
OPENAI_API_KEY= [YOUR KEY HERE]
```

## Running the application
Navigate to the root directory of the project at the command line and run this command: 

` docker-compose up --build`

The server will take a few minutes to build and start the first time you run it. Once its running, you should be able to view EasyEscrow in a browser at http://localhost:3000/ 

![EasyEscrow reference page](/EscrowScreenshot.png)