#!/bin/bash
pip3 install Flask
pip3 install Flask-Mail
pip3 install peewee
pip3 install pydantic
pip3 install PyJWT
pip3 install bcrypt
pip3 install Flask-CORS


# Dependencies from [tool.poetry.dependencies]
dependencies="
python = '^3.11'
lanfit-resp = '^0.1.2'
Flask = '^3.0.0'
pydantic = { version = '^1.8', platform = 'arm64' }
peewee = '^3.16.3'
pydantic-core = '^2.10.1'
bcrypt = '^4.0.1'
flask-mail = '^0.9.1'
pyjwt = '^2.8.0'
flask-cors = '^4.0.0'
"

# Parse package names and versions and install using pip
echo "$dependencies" | while IFS= read -r line
do
    # Skip lines that don't start with a package name (like 'python' or lines with 'platform')
    if [[ $line =~ [a-zA-Z0-9_-]+\s=\s\'.*\' ]]
    then
        # Extract package name and version
        package_name=$(echo $line | cut -d'=' -f1 | tr -d ' ')
        package_version=$(echo $line | cut -d"'" -f2)

        # Pip install the package
        pip install "${package_name}${package_version}"
    fi
done

echo "All packages installed successfully!"
