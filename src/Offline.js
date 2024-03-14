export function queueFormRequest(data) {
  try {
    const queuedRequests =
      JSON.parse(localStorage.getItem("queueFormRequest")) || [];
    // Check if the data already exists in the queue
    const isDuplicate = queuedRequests.some((item) => {
      return item.userId === data.userId; /* compare data */
    });

    if (!isDuplicate) {
      // Add the new data to the queue
      queuedRequests.push(data);

      // Limit the size of the queue if necessary
      const maxQueueSize = 100; // Example maximum queue size
      if (queuedRequests.length > maxQueueSize) {
        queuedRequests.splice(0, queuedRequests.length - maxQueueSize);
      }

      // Update the local storage with the updated queue
      localStorage.setItem("queueFormRequest", JSON.stringify(queuedRequests));
    }
  } catch (error) {
    console.error("Error queuing request:", error);
    // Handle error, e.g., notify the user or log the error
  }
}
