# SunBeam File Server

SunBeam is a simple file server for a node.js environment to install preferably on a linux machine.
It uses fs and multer to save files on the local filesystem an provides an API Rest for upload, download and delete those files.
It was made mainly to serve image files, but as a side effect, it just can server any type of file.

### Important Notes and Disclaimer
While efforts have been made to ensure its functionality, it might not represent the best or most comprehensive implementation.

By using and implementing SunBeam File Server, you acknowledge and accept that it is provided "as-is," and no warranties or guarantees of any kind are provided regarding its functionality, reliability, or suitability for any purpose.

You are solely responsible for ensuring that SunBeam File Server meets your requirements and for the appropriate use and implementation of the application. Use API-NodeMailer responsibly and ensure you understand the actions it performs.

## Download this software
```bash
git clone https://github.com/MarceloAndresMendoza/sunbeam-file-server
```

## Requirements

### Environment

SunBeam is designed to run on a Node.js environment. Ensure that you have the following components installed:

- [Node.js](https://nodejs.org/): SunBeam requires Node.js to execute its server-side JavaScript code.

Also, it comes with a handy script that installs this program as a service. Please refer to the install section. 

## Ports

Remember to open appropiate porst before using (even installing) this software. 
- Port 443: for cloning this repo via https
- Port 3000: or a custom port set on the install process

Check your firewall options if you are using UFW:
```bash
sudo ufw status
```
and your server's port forwarding options.

## Usage

SunBeam provides a RESTful API for upload and server files. Refer to the API endpoints documented below the install section.

# SunBeam Installation Script: 
**install.sh**

This script automates the installation of the API-NodeMailer program. It performs the following steps:

1. Copies the app files to target directory: /opt/sunbeam-file-store
2. Installs the app's dependencies.
3. Configures the API-NodeMailer server interactively.
4. Creates a systemd service to manage the Sunbeam process.

**Remember to take note of the api key you set on the install process.**

## Requirements

### Operating System

SunBeam is designed to run on Unix-like operating systems, including Ubuntu Linux distribution. While it may work on other systems, it's primarily tested and intended for use on this platform.

### User with Sudo Capability

To install and manage system services, you need administrative privileges. You should have a user account with sudo capability. This allows you to run commands with elevated privileges to install the service files, reload the systemd daemon, and manage the service.

## Usage

### Making the Script Executable

Before running the script, you need to make it executable:

```bash
chmod +x install.sh
```

## Checking the requisites
Ensure you have node and npm installed on your system before running the script:
```bash
node --version
npm --version
```
If not, you can install it via [nvm](https://github.com/nvm-sh/nvm)

After installing nvm, you should restart the terminal or run
```bash
source ~/.bashrc
```
 Then install node/npm as nvm's repo instructions.

### Running the Script
To run the installation script, execute the following command:

```bash
./install.sh
```
The script will guide you through the configuration process for the SunBeam program. Make sure to provide the requested information accurately.

Once the script completes successfully, the SunBeam program will be installed, configured, and running as a systemd service.

# Managing the Service
To stop the service, use the following command:

```bash
sudo systemctl stop sunbeam
```

To disable the service (prevent it from starting on boot):

```bash
sudo systemctl disable sunbeam
```

## Uninstallation
If you need to uninstall the SunBeam program, follow these steps:

Stop the service and disable it:

```bash
sudo systemctl stop sunbeam
sudo systemctl disable sunbeam
```

Delete the installation folder:

```bash
sudo rm -rf /opt/sunbeam
```

Delete the service file, be careful since you can accidentally delete another file, this step is optional while you keep the service disabled.

```bash
sudo rm /etc/systemd/system/sunbeam.service
```

# Using the API
- The *GET* to your _server:port/ method will inform you about the status of the service. Also will give you the diferent methods accepted and formats.

# If no errors on install but can't connect to the API
- Ensure you are using the machine's public ip
- Check your open ports, if using a local pc ensure your router or modem has the port open and redirected to your machine (but not needed to test on local environment)
- Check your machine's firewall
- If you have push recent changes to the DNS: these changes takes time to propagate
- If using AWS/Azure/Google Cloud: ensure your machine's network/security groups policies has 4200 (or any configured) port allowed for inbound/outbound traffic

# Important Notes

Review the generated configuration file (.env) to ensure the accuracy of the provided information.

After successful installation, the script recommends deleting the installation folder. Make sure you have verified the successful operation of the SunBeam program before doing so.

If you encounter any issues during installation, review the script steps, check for error messages, and review the status of the systemd service.

Please use this script responsibly and ensure that you have the necessary permissions and understanding of the actions it performs.

Note: This script is provided as-is and does not guarantee a flawless installation in all environments. Review, customize, and test the script based on your specific requirements.
