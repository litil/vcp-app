# VCP APP

VCP is an amateur radio application written in AngularJS (not AngularJS 2 for now) and using Laravel 5. The radio contains several playlists which are played one after the other, in an order defined by a static planning.

As this application is under development and not yet released, the original radio is still available here :
http://vendredicestpermis.com/

## Installation and Usage
As this project uses Laravel 5, you can follow this [getting started with Laravel 5 tutorial](https://laravel.com/docs/5.1/quickstart). 

Then, you'll have to update the .env file to set the correct database credentials and you'll have to update your Homestead configuration. Once you're done, run : 
```
vagrant up --provision
```

## Todos
I'm not using Github issues to keep track of all remaining bugs to fix and new features to implement but Asana. The main task I've still to work on is fixing the design for tablets and mobile phones. Even though this project uses Bootstrap 3, I still have a "few" stuff to fix.

## Stack
  * `UI` 
    * AngularJS
    * Bootstrap 3
    * [Angular SoundManager2](http://perminder-klair.github.io/angular-soundmanager2/) 
  * `Server Side` - PHP, Laravel 5
  * `Database` - MySQL
  * `Cloud Platform` - AWS
  * `Deployment` - Rocketeer
  
## Screenshots
The main screen of the app is the "Ticket" view, where you can start the radio and see which songs is currently played. 
![alt tag](https://github.com/litil/vcp-app/blob/master/docs/images/ticket.png)

After 15 minutes, the user must log in, otherwise the radio will stop. He can do so in the authentication part of the app.
![alt tag](https://github.com/litil/vcp-app/blob/master/docs/images/boarding.png)

The "About" view shows the actual playlists planning. There is no way to update that planning for now.
![alt tag](https://github.com/litil/vcp-app/blob/master/docs/images/about.png)

The "Extras" view shows the available playlists. By default, the one being played is the one defined in the planning and corresponding to the current date and time. But the user can switch to another playlist, just by clicking on it in this view.
![alt tag](https://github.com/litil/vcp-app/blob/master/docs/images/extras.png)



