#!/bin/bash

#COLORS
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

######## INITIALIZE REACT APP
echo -e "${YELLOW}Installing airfinder app dependencies${NC}"
cd airapp
npm i
if [ $? -eq 0 ]; then    
    echo -e "${GREEN}Application has successfully initialized${NC}"
else
    echo -e "${RED}The application failed to init :(${NC}"
    cd ..
    return
fi

######## INITIALIZE SERVER APP
cd ..
echo -e "${YELLOW}Installing arfinder server dependencies${NC}"
cd airserver
npm i
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Server has successfully initialized${NC}"
else
    echo -e "${RED}The server failed to init :(${NC}"
    cd ..
    return
fi
cd ..
