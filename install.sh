#!/bin/bash
echo "========================================================"
echo "This script will install the SunBeam File Server program"
echo "========================================================"

# Check if node.js is installed
if ! [ -x "$(command -v node)" ]; then
    echo "====================================================" >&2
    echo "CRITICAL ERROR: node.js is not installed." >&2
    echo "Install it via npm. " >&2
    echo "https://github.com/nvm-sh/nvm" >&2
    echo "====================================================" >&2
    exit 1
fi

# Specify the source directory of the node.js app
SOURCE_DIR="./"

# Specify the target directory where the app will be copied and run
TARGET_DIR="/opt/sunbeam-file-store"

# Get node path on PATH env
NODE_PATH=$(which node | grep 'node')

# Get the current username
CURRENT_USER=$(whoami)
CURRENT_GROUP=$(id -gn)

# Check if the env file exists
if [ -f "$TARGET_DIR/.env" ]; then
    # Update the program
    echo "Program already installed, updating..."
    # Copy your app files to the target directory
    echo "Copying files..."
    sudo cp -r "$SOURCE_DIR"/* "$TARGET_DIR/"
    # Navigate to the target directory
    cd "$TARGET_DIR"
    sudo chown -R $CURRENT_USER:$CURRENT_GROUP .

    # Install your app's dependencies (if needed)
    echo "Installing dependencies..."
    npm install
    # Restart the service
    echo "Restarting the service..."
    sudo systemctl restart sunbeam
    sudo systemctl status sunbeam
    echo "Update finished."
else
    # Copy your app files to the target directory
    echo "Copying files..."
    sudo mkdir -p "$TARGET_DIR"
    sudo cp -r "$SOURCE_DIR"/* "$TARGET_DIR/"
    # Navigate to the target directory
    cd "$TARGET_DIR"
    sudo chown -R $CURRENT_USER:$CURRENT_GROUP .

    # Install your app's dependencies (if needed)
    echo "Installing dependencies..."
    npm install
    # Create the uploads folder
    echo "Creating uploads folder..."
    mkdir -p public/uploads
    # Configure the server
    echo "SUNBEAM CONFIGURATION"
    echo "Please, take your time to configure properly these options."
    echo "==========================================================="

    read -p "Enter CORS origin (e.g., *): " CORSORIGIN
    read -p "Enter api version (e.g., 0): " APIVERSION
    read -p "Enter api key: " APIKEY
    read -p "Enter port number (e.g., 3000 / MAX: 65536): " PORT
    read -p "Enter max file size on bytes (e.g., 10000000, seven zeroes, are 10 mb): " MAXFILESIZE

    # Generate the configuration file, hardcoding some values
    cat << EOF > .env
    # Configuration file generated on install.
    PORT=$PORT
    CORSORIGIN='$CORSORIGIN'
    APPNAME='Sunbeam File Server'
    APPAUTHOR='Marcelo Mendoza'
    APPVERSION='1.0.5'
    APPDESCRIPTION='A simple file server. Upload, download and delete files.'
    APPDATE='October 10, 2023'
    APPCOPYRIGHT='(c) 2013 Marcelo Mendoza'
    APPGITHUB='https://github.com/doblefoco/sunbeam'
    APIVERSION=$APIVERSION
    APIKEY='$APIKEY'
EOF

    # Generate the service file
    echo "Generating service file..."
    echo "[Unit]
Description=Sunbeam File Server
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
Group=$CURRENT_GROUP
WorkingDirectory=$TARGET_DIR
ExecStart=$NODE_PATH $TARGET_DIR/server.js
Restart=always

[Install]
WantedBy=multi-user.target" > sunbeam.service

    # Create a systemd service file
    echo "Creating system service..."
    sudo cp sunbeam.service /etc/systemd/system/sunbeam.service
    sudo systemctl daemon-reload
    sudo systemctl enable sunbeam
    sudo systemctl start sunbeam
    sudo systemctl status sunbeam
fi

echo "===================================================="
echo "Installation finished."
echo "Check the above result of the service status."
echo "===================================================="
echo If everything is ok, you can safely delete this folder.
echo - Installation location: $TARGET_DIR
echo - To stop the service: systemctl stop sunbeam
echo - To disable the service: systemctl disable sunbeam
echo "==========================================================="
