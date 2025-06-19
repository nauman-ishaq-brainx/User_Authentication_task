const cron = require("node-cron");
const { taskService, userService } = require("../services");
const { sendEmail } = require("./emailSender");

const reminderJob = cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const reminderStart = new Date(now.getTime() + 59 * 60 * 1000); 
    const reminderEnd = new Date(reminderStart.getTime() + 60 * 1000);

    const tasks = await taskService.findAllTasks({
      dueDate: { $gte: reminderStart, $lt: reminderEnd },
      isCompleted: false,
      reminderSent: false,
    });


    for (const task of tasks) {
      const user = await userService.findUser(task.user);
      if (!user || !user.email) continue;

      await sendEmail({
        to: user.email,
        subject: "⏰ Task Reminder",
        html: `<p>Your task "${task.name}" is due at ${task.dueDate.toLocaleString()}.</p>`,
      });

      await taskService.updateTask({ _id: task._id }, { reminderSent: true });
    }

    console.log(`✔️ Reminder job ran at ${now.toLocaleString()}`);
  } catch (err) {
    console.error("❌ Reminder job error:", err.message);
  }
});

module.exports = reminderJob;
