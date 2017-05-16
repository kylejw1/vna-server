# Installing from scratch

## Server

1. Format SD card FAT32
2. Flash 2017-04-10-raspbian-jessie-lite.img 
3. Create file "ssh" in root
4. ssh to pi

```
ssh pi@[ip address]
```

5. Expand filesystem and set Hostname
```
sudo raspi-config
Advanced Options -> Expand Filesystem
Set Hostname
vna-server
Finish
(Answer Yes to Reboot)
```

5. Create ram disk for logs/cache/etc

```
sudo mkdir /ramdisk
sudo nano /etc/fstab
# Append the following
tmpfs /var/log tmpfs nodev,nosuid,size=100M 0 0
tmpfs /ramdisk tmpfs nodev,nosuid,size=200M 0 0
sudo reboot now

```

6. Update and install nodejs
```
sudo apt-get update
sudo apt-get install nodejs
``` 

