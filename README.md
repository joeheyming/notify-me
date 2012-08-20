# notify-me
=========

Send notifications to your mac over http.

The notifications are caught by a web server on your mac powered by node.js and forwarded to CocoaDialog.

CocoaDialog uses a pretty simple command line interface that can create many different types of dialogs.
It might be useful to read a few of the [examples](http://mstratman.github.com/cocoadialog/#examples)

## Installation
Install node.js.  This can easily be done with macports:
```bash
    $ sudo port install nodejs
```

Run make:
```bash
    $ make install
```

## Running
To run the application you can find it in the bin directory:
```bash
    $ ./bin/notify-me.js
    Running notify-me.js on port 3000
```

If you want to run on a differnt port use the NOTIFYMEPORT environment variable:
```bash
    $ export NOTIFYMEPORT=4000
    $ ./bin/notify-me.js
    Running notify-me.js on port 4000
```

Then run an http request to the server:
```bash
    $ curl "localhost:3000/bubble?title=hello&text=world"
```
The path is the type of dialog you want to display.  There are many different dialogs found in the CocoaDialog documentation.

The query strings translate to command line arguments to the CocoaDialog binary.
I try to sanitize all input.  Any value can be anything but a single quote.  This prevents an attacker from escaping the value and injecting harmful shell code.
Values can be any alphanumeric string (- or _ are ok) with no spaces.

If anyone knows a better regular expression for sanitizing the input, please let me know.

I created an example script to help you get started under ./bin/notify-example.sh

The main idea for this script was so that you could have a long running process and when it is finished, it pops up a message to you while you are browsing the internet or reading emails.

For example:
```bash
    $ make && all-okay || oh-no-build-failed
    # where all-okay or oh-no-build-failed map to some alias/bash function: 
    #   curl -G --data-urlencode "title=Build complete" --data-urlencode "text=`date`" 1.2.3.4:3000/ok-msgbox
    
```
Would notify me when the build was complete while I was surfing the internet at work.
I feel this is better than just sending myself an email because I might not be looking at email.
But a popup would be much better at getting my attention.

## HTTPS
If you want more security around running these commands, you can genearte a private key and a certificate to use with curl:
```bash
        $ openssl genrsa -out privatekey.pem 1024 
        $ openssl req -new -key privatekey.pem -out certrequest.csr 
        $ openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
        
        # Then you need to set these environment variables:
        $ export NOTIFYMEKEY=path/to/privatekey.pm
        $ export NOTIFYMECERT=path/to/certificate.pem
        
        # Then restart notify-me.js
        $ notify-me.jss
        Reading in https certs
        Running notify-me.js on port 3000

        # Then when you run curl:
        $ curl -v -s -k --key privatekey.pem --cert certificate.pem 'https://localhost:3000/bubble?title=hello&text=world'

```

I don't claim to be a security expert, but I hope this is good enough to prevent people from getting spammed..

## Screenshot
![notify-me Notify me in Action](/joeheyming/notify-me/blob/master/notify-me-in-action.png?raw=true)
