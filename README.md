# HamRadio_Remote_HTML5
Ham radio interface in html5 for remote use by full web interface with audio (mic and speaker)

see vidéo on https://youtu.be/klh2mSd2Ea8 

![alt text](https://github.com/F4HTB/HamRadio_Remote_HTML5/blob/master/Presentation.png?raw=true)

Diagram for sound:

![alt text](https://github.com/F4HTB/HamRadio_Remote_HTML5/blob/master/sound_diagram.png?raw=true)


Diagram for rtl:

![alt text](https://github.com/F4HTB/HamRadio_Remote_HTML5/blob/master/rtlsdr_diagram.png?raw=true)

see at https://f6cxo.pagesperso-orange.fr/cariboost_files/FT817_20PANADAPTER.pdf or use without.

sudo apt-get install python3-pyaudio  python3-serial python3-tornado python3-matplotlib rtl-sdr python3-numpy python3

git clone https://github.com/F4HTB/HamRadio_Remote_HTML5.git

chmod 755 ./R817

./R817

and connect with firefox or chrome to:

https://raspberrypi.local:8888/