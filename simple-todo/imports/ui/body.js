import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './task.js';
import './body.html';

//attach reactice dict to the body when created
Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
});

Template.body.helpers({
	// tasks: [
	// 	{text: "task1"},
	// 	{text: "task2"},
	// 	{text: "task3"},
	// ],
	tasks() {
		const instance = Template.instance();
		if (instance.state.get('hideCompleted')) {
			//if hide completed checkbox is ticked, only show unchecked tasks (ie. checked not equals true)
			return Tasks.find({ checked: {$ne: true} }, { sort: {createdAt: -1} });
		} else {
			return Tasks.find({}, { sort: {createdAt: -1} });//sorts with newest tasks on top
		}
	},
	//counts number of unchecked tasks
	countUnchecked() {
		return Tasks.find({ checked: {$ne: true} }).count();
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
	},
	'change .hide-completed input'(event, instance) {
		//set value of key 'hideCompleted' in the reactive dict to the checkbox value
		instance.state.set('hideCompleted', event.target.checked);
	}
});
