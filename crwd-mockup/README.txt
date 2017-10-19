We're using flask to rapidly build a UI as input for the functional 
description of the application.

Setup instruction on Linux
==========================
We will be using a virtualenv to prevent dependencies on system 
wide installed software

  $ virtualenv venv
  Running virtualenv with interpreter /usr/bin/python2
  ...
  Installing setuptools, pkg_resources, pip, wheel...done.
  
  $ ./venv/bin/pip install --editable .
  Obtaining file:///home/nederhoed/work/crwd-prototype/crwd-mockup
  Collecting flask
  ...
  Successfully installed Jinja2-2.9.6 flask-0.12.2 mockup

  $ export FLASK_APP=mockup
  $ export FLASK_DEBUG=true
  $ ./venv/bin/flask run
