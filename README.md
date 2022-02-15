# Workout Builder React Application

This app is built using the WGER Api. Huge thanks to the authors of that project for making this API publicly available.

[Check out the site here](https://the-workout-planner.com)

### How to interact with the site

This project gives the user access to a database of exercises provided by the wger database. A user can search by category (e.g Arms, Legs, Back), by a specific muscle, or by equipment. The user also has the ability to create an exercise that will be available only to them. The user can create workouts by combining exercises. Each exercise in a workout can be given a certain of sets, and each set can be described by either how much weight and how many reps, or by time. The user can also create a routine based on a Monday - Sunday calendar, assigning up to one workout per day, or labeling it as a rest day. A user can have multiple routines, but set only 1 as the active routine. You may also record workouts. If you have an active routine, then the record workout page will be pre-loaded with the workout that corresponds to that day of the week. You can modify that workout be eliminating exercises, or adding or modifying the sets / reps / weight / time. You may also change the selected workout to record. There is also a custom built date picker (guided by a medium blog post) that will allow you to record workouts from past or future days.

### The tech I used.

This is my first big React project. I followed the Maximilian Schwarzmuller Udemy course to get started with React (before it was recently updated). This project is built using React Hooks, and Redux for state management using the redux toolkit. I used Firebase for the database and Auth system. There are robust rules inside the database to properly protect the data. I also used React-Select, React-Icons, and React-Transition-Group. I used CSS modules for styling, with custom properties inside of index.css. There is extensive testing using Jest and react-testing-library

### Thanks for taking the time to check out my project!
