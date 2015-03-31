#Build List App

*BUILD/FIREWALL updates:*

I have named this project Build List App and I will explain bellow a little bit my implementation.

I have considered a list of BUILDS(E.g. Tenrox-R1_1235) and each build item from the list, can contain multiple FIREWALL tasks (E.g. 432462). 

As displayed in the designs, for each FIREWALL task multiple JOBS are executed (unit tests, functional tests, metrics, builds).

Eeach JOB is updated at a certain time interval (5s) and for updating their states, I have used a similar approach that JENKINS is currently using:
* Based on the estimation time (that is hardcoded in my mockups) of the last JOB run, I know how update the loader bar of the running job.
* When the estimation time ends, the app should request server for an answer to see if the job really ended. If YES than the server should answer with the JOBS` status (complete or rejected) .If NO, then our app should make multiple requests at a certain time interval until a status is received, then we can update the estimation time with the new one. (I didn't had time to implement this logic);
* Another way our app could work, is using websockets. Each firewall could subscribe to a specific channel and receive live updates. (We can discuss about this solution in a meeting if needed).

When all FIREWALLS of a BUILD are updated then the app is calculating the arithmetic mean between all FIREWALLS` JOBS and updates the JOBS of a BUILD item.

*Displaying results of a BUILD/FIREWALL*

As described in the app requirements, each BUILD/FIREWALL can have 4 states: pending, running, complete, rejected;

- pending: when the build list is loaded and prepares for receiving updates;
- running: when each build/firewall item is updating;
- complete/rejected: when the job finishes and the server sends the final status;

For displaying the results of a specific item, the user needs to click on the items` id. The results (which I haven't styled as per design because of the time limitation) will be displayed only it the items` status is complete or rejected, otherwise a dialog box will be displayed, announcing the user that the item is in the pending or running state.


I hope that this document clarifies what I've done for this test, and if you have further questions, don't hesitate to contact me.

 


