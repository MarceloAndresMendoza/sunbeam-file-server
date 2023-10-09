#!/bin/bash
echo "===================================================="
echo "This script will install the API-NodeMailer program."
echo "===================================================="

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
    # Configure the server
    echo "SUNBEAM CONFIGURATION"
    echo "Please, take your time to configure properly these options."
    echo "==========================================================="

    read -p "Enter CORS origin (e.g., *): " CORSORIGIN
    read -p "Enter api version (e.g., 0): " APIVERSION
    read -p "Enter api key: " APIKEY
    read -p "Enter port number (e.g., 3000): " PORT

    # Generate the configuration file, hardcoding some values
    cat << EOF > .env
    # Configuration file generated on install.
    PORT=$PORT
    CORSORIGIN='$CORSORIGIN'
    APPNAME='Sunbeam File Server'
    APPAUTHOR='Marcelo Mendoza'
    APPVERSION='0.1.1'
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
    echo systemctl status sunbeam
fi

echo "===================================================="
echo "Installation finished."
echo "Check the above result of the service status."
echo "===================================================="
echo If everything is ok, you can safely delete this folder.
echo - Installation location: $TARGET_DIR
echo - To stop the service: systemctl stop api-nodemailer
echo - To disable the service: systemctl disable api-nodemailer
echo "==========================================================="
