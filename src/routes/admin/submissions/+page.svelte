<script>
  export let data;

  function formatEvents(events) {
    if (!events || events.length === 0) return 'No scheduled times';
    return events
      .map(e => `${e.day_of_week}: ${e.start_time.slice(0, 5)}`)
      .join('\n');
  }

  async function handleApprove(clubId) {
    const res = await fetch(`/admin/submissions/${clubId}/approve`, { method: 'POST' });
    if (res.ok) {
      window.location.reload();
    }
  }

  async function handleReject(clubId) {
    const res = await fetch(`/admin/submissions/${clubId}/reject`, { method: 'POST' });
    if (res.ok) {
      window.location.reload();
    }
  }
</script>

<div class="max-w-7xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Pending Submissions</h1>

  {#if data.submissions.length === 0}
    <p class="text-gray-500 text-center">No pending submissions</p>
  {:else}
    <div class="grid gap-6">
      {#each data.submissions as submission}
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold">{submission.name}</h2>
              <p class="text-gray-600">{submission.city_name}</p>
            </div>
            <div class="flex gap-2">
              <button
                on:click={() => handleApprove(submission.id)}
                class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
              >
                Approve
              </button>
              <button
                on:click={() => handleReject(submission.id)}
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Schedule:</strong></p>
              <pre class="whitespace-pre-line">{formatEvents(submission.events)}</pre>
              <p><strong>Location:</strong> {submission.location}</p>
            </div>
            <div>
              <p><strong>Instagram:</strong> {submission.instagram || 'N/A'}</p>
              <p><strong>Facebook:</strong> {submission.facebook || 'N/A'}</p>
              <p><strong>Submitter:</strong> {submission.submitter_email}</p>
            </div>
          </div>

          <p class="mt-4 text-gray-700">{submission.description}</p>
        </div>
      {/each}
    </div>
  {/if}
</div> 