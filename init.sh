[Unit]
Description=Mail
After=network.target network-online.target
Requires=network-online.target

[Service]
ExecStart=/bin/bash /usr/bin/Mail/init.sh
ExecReload=/bin/bash /usr/bin/Mail/init.sh

[Install]
WantedBy=multi-user.target

sudo chmod 644 /etc/systemd/system/mail.service

sudo systemctl status mail

sudo systemctl start mail

sudo systemctl restart mail
sudo systemctl enable mail


rsync -a Mail root@157.245.209.46:~
