import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';

import './body.html';

Template.body.helpers({
	// tasks: [
	// 	{text: "task1"},
	// 	{text: "task2"},
	// 	{text: "task3"},
	// ],
	tasks() {
		//sorts with newest tasks on top
		return Tasks.find({}, {sort: { createdAt: -1 }});
	}
});

// Add submit event listener
Template.body.events({
	'submit .new-task'(event) {
		// == This is the event handler ==

		//prevent default browser form submit
		event.preventDefault();

		const target = event.target;
		const text = target.text.value;

		//insert task into collection
		Tasks.insert(
			{ text, createdAt: new Date()}
		);

		//clear form
		target.text.value = '';
	}
});
