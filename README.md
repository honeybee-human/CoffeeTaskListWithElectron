## CoffeeTaskList

CoffeeTaskList is a a simple real-time updating to-do list
featuring custom-designed UI elements, drag and drop of tasks, create/update/delete, time completed, priority levels and search. This is designed with the idea of creating tiny tasks, such as "open the school website in a new tab", which a user might find unreasonable or troublesome to list in a task manager that would save these states.

### Built with
* HTML
* CSS
* JavaScript
* ElectronJS

### Install
1. Install NPM packages
```npm install```
2. Install ElectronJS
```npm install --save-dev electron```
3. Start application
```npm start```

### Features
Create tasks by writing in the text field, then clicking "+" button or pressing enter. It will appear in the to-do list container and each to-do item can be drag and dropped into a different order in the list, checked completed with the checkbox, and deleted with the garbage bin icon. Your progress bar updates once a checkbox is clicked, updating to represent tasks completed out of tasks on the list. This is to be used as your smallest steps task tracker, such as "open the tab for the school website", with a maximum of 7 tasks at a time to prevent analysis paralysis and to break down tasks into smaller chunks without filling or saving unreasonable amounts of tiny tasks. The time a task is completed is listed once a task is marked done. If you are continuously working on these tasks one after another, if one task takes too long, then you may have time blindness for this task - break it into smaller pieces. For different window sizes or to see only a certain task one at a time, use the search bar to specify what you want to see. Priority levels are added, keep in mind that 80% of the progress can be done with 20% of the effort.
