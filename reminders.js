const schedule = require('node-schedule');

function scheduleReminders(items) {
  items.forEach(item => {
    if (item.reminderTime && item.name) {
      const reminderTime = new Date(`2023-01-01T${item.reminderTime}`);
      schedule.scheduleJob(reminderTime, function () {
        console.log(`Reminder for task "${item.name}" at ${item.reminderTime}`);
      });
    }
  });
}

module.exports = {
  scheduleReminders,
};