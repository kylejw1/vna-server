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
tmpfs    /root/.pm2/logs    tmpfs    defaults,noatime,nosuid,mode=0755,size=100m    0 0
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

8. Configure pm2
```
# Start on boot - execute the command this outputs if necessary
sudo pm2 startup
sudo pm2 install pm2-logrotate
sudo pm2 set pm2-logrotate:max_size 20MB
sudo pm2 set pm2-logrotate:retain 0
sudo pm2 save
```

8. Clone app and start pm2

```
git clone https://github.com/kylejw1/vna-server.git
git checkout release
cd vna-server
sudo pm2 start pm2.json
sudo pm2 save
```

9. Set login password

```
cd vna-server/back
mkdir secret
echo "PASSWORD" > secret/auth.pass
```

asdfasdfa
...

log file is not being set right
remove ssh file
or optionally turn off pwd login and install ssh key
set the environment variables for token and pw
