I. Instructions on how to use github (Short version)

1. Stay Updated:
   git pull origin
3. Committing Your Changes at your local machine:
   git add .
   git commit -m "A descriptive message about your changes"
4.Pull Before Push:
  git pull origin
5.Push Your Branch:
  git push origin


II. Instructions on how to run the website at the Terminal:

1. Start the backend
1)cd backend
2.1) Install packages using poetry
   pip install poetry
   poetry install
   go to Virtual Environment
2.2) Install packages using shell script
   ./install_dependencies.sh  
3)python3 app.py

2. Start the frontend
cd frontend
yarn install
yarn start
