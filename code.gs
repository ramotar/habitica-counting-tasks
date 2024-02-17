// [Authors] Place all other functions in this or other separate files
// - Ideally prefix functions that access the API with "api_" to quickly see which ones
//   access the API and to be able to budget your 30 requests per minute limit well

function processWebhookInstant(type, data) {
  // [Authors] This function gets called immediately,
  //   whenever a webhook of your script is activated.
  // - Place immediate reactions here.
  // - Make sure, that the processing time does not exceed 30 seconds.
  //   Otherwise you risk the deactivation of your webhook.

  let counterRegExp = new RegExp("^(?<flag>Counter|Countdown): (?<counter>[0-9]+)(?=\\n|$)");

  let task = data.task;

  // scored a ToDo in direction up
  if (task.type == "todo" && data.direction == "up") {
    let matches = task.notes.match(counterRegExp);

    logDebug(matches);

    // scored a counting task
    if (matches !== null) {
      let flag = matches.groups.flag;
      let counter = Number(matches.groups.counter);
      let match = matches[0]

      let increment = (flag == "Counter" ? 1 : -1);
      counter += increment;

      if (counter > 0) {
        // create a new task with the updated counter

        let newTask = new Object();
        newTask.text = task.text;
        newTask.type = task.type;
        newTask.tags = task.tags;
        newTask.attribute = task.attribute;
        newTask.checklist = task.checklist;
        newTask.collapseChecklist = task.collapseChecklist;
        newTask.notes = task.notes.replace(match, flag + ": " + counter);
        newTask.date = task.date;
        newTask.priority = task.priority;

        api_createUserTask(newTask);
      }
    }
  }

  return false;
}

function processWebhookDelayed(type, data) {
  // [Authors] This function gets called asynchronously,
  //   whenever a webhook of your script is activated.
  // - Here you can take care of heavy work, that may take longer.
  // - It may take up to 30 - 60 seconds for this function to activate
  //   after the webhook was triggered.
}

function processTrigger() {
  // [Authors] This function gets called by the example trigger.
  // - This is the place for recurrent tasks.
}
