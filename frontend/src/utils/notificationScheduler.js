// Client-side notification scheduler
// Fires a browser notification at the user's chosen daily time

let schedulerTimeoutId = null;

/**
 * Calculate milliseconds until the next occurrence of the given HH:MM time.
 */
function msUntilTime(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    // If the target time has already passed today, schedule for tomorrow
    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    return target - now;
}

/**
 * Start the notification scheduler.
 * Fires a notification at the given time, then reschedules for the next day.
 * @param {string} time - Time in "HH:MM" format
 * @param {string} userName - User's display name
 */
export function startNotificationScheduler(time, userName = "Student") {
    // Clear any existing schedule
    stopNotificationScheduler();

    if (!time || Notification.permission !== "granted") return;

    const delay = msUntilTime(time);

    console.log(
        `[NotifScheduler] Notification scheduled for ${time} (in ${Math.round(delay / 60000)} minutes)`
    );

    schedulerTimeoutId = setTimeout(() => {
        // Fire the notification
        new Notification(`${userName}'s DSA Journey 🚀`, {
            body: "Time to study! Keep your streak alive 🔥",
            icon: "/vite.svg",
        });

        // Reschedule for the next day (24 hours from now)
        schedulerTimeoutId = setTimeout(() => {
            startNotificationScheduler(time, userName);
        }, 1000); // Small delay before rescheduling
    }, delay);
}

/**
 * Stop the notification scheduler.
 */
export function stopNotificationScheduler() {
    if (schedulerTimeoutId) {
        clearTimeout(schedulerTimeoutId);
        schedulerTimeoutId = null;
        console.log("[NotifScheduler] Scheduler stopped");
    }
}
