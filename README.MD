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
sudo nano /etc/fstab
# Append the following
tmpfs    /tmp    tmpfs    defaults,noatime,nosuid,size=200m    0 0
tmpfs    /var/tmp    tmpfs    defaults,noatime,nosuid,size=30m    0 0
tmpfs    /var/log    tmpfs    defaults,noatime,nosuid,mode=0755,size=200m    0 0
#tmpfs    /var/run    tmpfs    defaults,noatime,nosuid,mode=0755,size=2m    0 0
tmpfs    /var/spool/mqueue    tmpfs    defaults,noatime,nosuid,mode=0700,gid=12,size=30m    0 0

sudo reboot now

```

6. Update and install nodejs, git
```
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install nodejs git
sudo chmod a+rwx -R /usr/lib/node_modules/
``` 

7. Set npm cache location and install bower/pm2

```
sudo npm config --global set cache /tmp/.npm
sudo npm install -g pm2 bower
```

8. Start pm2 on boot
```
sudo pm2 startup
```

8. Clone app and start pm2

```
git clone https://github.com/kylejw1/vna-server.git
git checkout release
cd vna-server
sudo pm2 -l /var/log/vna-server.log start pm2.json
sudo pm2 save
```

asdfasdfa
...

remove ssh file
or optionally turn off pwd login and install ssh key

