import os
import flask
from flask import request, session
from flask import redirect, flash

import models

REGISTRY = [
    models.Entry('0x0001', 'NL-123456789'),
    models.Entry('0x0002', 'NL-198854321'),
    models.Entry('0x0003', 'NL-987654321'),
]

app = flask.Flask(__name__)
app.config.from_object(__name__) # load config from this file

# Session key
app.config.update(dict(SECRET_KEY='development key'))

# skip DB setup for now
#app.config.update(dict(
    #DATABASE=os.path.join(app.root_path, 'flaskr.db'),
    #USERNAME='admin',
    #PASSWORD='default'
#))
# Optional environment settings
app.config.from_envvar('MOCKUP_SETTINGS', silent=True)

@app.route('/favicon.ico')
def favicon():
    return flask.send_from_directory(
        os.path.join(app.root_path, 'static'), 'favicon.png')

@app.route('/')
def show_entries():
    tpl = 'index.html'
    if session.get('logged_in'):
        tpl = 'index-notary.html'
    return flask.render_template(tpl, entries=REGISTRY)

@app.route('/add', methods=['POST'])
def add_entry():
    try:
        entry = models.Entry(
            request.form['address'],
            request.form['ssn'])
    except:
        raise
    REGISTRY.append(entry)
    flash('New entry was successfully posted')
    return redirect(flask.url_for('show_entries'))

@app.route('/verify', methods=['POST', 'GET'])
def verify_id():
    try:
        address = request.form['address']
        status = request.form['status']
    except:
        flash('Address status unchanged')
    else:
        for i in REGISTRY:
            if i.address == address:
                i.status = i.next()
                break
        flash('Address %s was successfully verified' % address)
    return redirect(flask.url_for('show_entries'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    session['logged_in'] = True
    flash('Welcome notary')
    return redirect(flask.url_for('show_entries'))

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('Welcome investor')
    return redirect(flask.url_for('show_entries'))