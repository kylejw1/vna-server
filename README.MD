# Installing from scratch

## Server

1. Format SD card FAT32
2. Flash 2017-04-10-raspbian-jessie-lite.img 
3. Create file "ssh" in root
4. ssh to pi

```
ssh pi@[ip address]
```

4. Set up hotspot

```
sudo apt-get install dnsmasq hostapd

```
sudo nano /etc/dhcpcd.conf
# Append the following: (above any 'interface' lines)
denyinterfaces wlan0  
```

```
sudo nano /etc/network/interfaces
# Edit wlan0 to match:
allow-hotplug wlan0  
iface wlan0 inet static  
    address 172.24.1.1
    netmask 255.255.255.0
    network 172.24.1.0
    broadcast 172.24.1.255

sudo service dhcpcd restart
sudo ifdown wlan0; sudo ifup wlan0
```

```
sudo nano /etc/hostapd/hostapd.conf

# Copy the following:

interface=wlan0
driver=nl80211
ssid=vnawifi
hw_mode=g
channel=6
ieee80211n=1
wmm_enabled=1
ht_capab=[HT40][SHORT-GI-20][DSSS_CCK-40]
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_passphrase=imhungry
rsn_pairwise=CCMP 

```

```
sudo nano /etc/default/hostapd
# Replace #DAEMON_CONF="" with:
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```

```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig  
sudo nano /etc/dnsmasq.conf

# Copy the following:

interface=wlan0      # Use interface wlan0  
listen-address=172.24.1.1 # Explicitly specify the address to listen on  
bind-interfaces      # Bind to the interface to make sure we aren't sending things elsewhere  
server=8.8.8.8       # Forward DNS requests to Google DNS  
domain-needed        # Don't forward short names  
bogus-priv           # Never forward addresses in the non-routed address spaces.  
dhcp-range=172.24.1.50,172.24.1.150,12h # Assign IP addresses between 172.24.1.50 and 172.24.1.150 with a 12 hour lease time    
```

```
sudo nano /etc/sysctl.conf
# Uncomment:
net.ipv4.ip_forward=1
```

```
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE  
sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT  
sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT  
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"

sudo nano /etc/rc.local
# Append before 'exit 0'
iptables-restore < /etc/iptables.ipv4.nat
```

```
sudo reboot now
```

```
sudo service hostapd enable  
sudo service dnsmasq enable  
sudo service hostapd start  
sudo service dnsmasq start  
```


5. Set Hostname
```
sudo raspi-config
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
cd vna-server
git checkout release
git pull
sudo pm2 start pm2.json
sudo pm2 save
```

9. Set login password

```
cd vna-server/back
mkdir secret
echo "PASSWORD" > secret/auth.pass
```

10. Copy ssh key to pi and disable password login

(Substitute in the pi address/hostname)

```
ssh-copy-id pi@000.000.000.000

sudo nano /etc/ssh/sshd_config
#Change:
#PasswordAuthentication yes
#To:
PasswordAuthentication no

# Save and exit

sudo /etc/init.d/ssh restart
```

11. Backup

Use win32diskimager to create an image backup of the SD card


12. Expand Filesystem

```
sudo raspi-config
Advanced Options -> Expand Filesystem
Finished (yes to reboot)
```


## Client

1. Transfer ssh keys from pi clients to the server so they can be used to log in

(Substitute in the server pi address/hostname)

```
ssh-keygen -t rsa 
ssh-copy-id pi@000.000.000.000
```

