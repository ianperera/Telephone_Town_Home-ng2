Conference Setup UI
===================

Conference setup user interface.  Written in HTML 5 and Angular 2.

This is an Angular 2 project.  It uses Typescript, and is built with
gulp and webpack.

You may find it useful to install http-server directly in your system:

        sudo npm i -g http-server

Gulp can be installed via:

        sudo npm i -g gulp-cli

To start running:

        npm install
        gulp setup
        gulp dev
        http-server app -c-1 -o

For local development, you can also use

        npm start

then visit http://127.0.0.1:8080/ to access the UI.


### Deploying to dev

We do not yet have an automated method for deploying to dev.  The current technique is as follows:

        gulp setup
        gulp dev
        # after this step, you should commit the project as its version will be updated
        gulp release

        # scp the release to the system.
        scp release.zip my.user@10.14.25.123:/tmp
        scp revRelease.zip my.user@10.14.25.124:/tmp

        # this process on each dev host
        ssh my.user@10.14.25.123
        cd /root/telweb/webpages/confsetup
        sudo unzip -o /tmp/devRelease.zip
        # repeat process for .124

### Release Notes

v1.0.1
 - development release

v1.0.0
 - initial version
