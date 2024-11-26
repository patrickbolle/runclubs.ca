<script>
  export let data;
  export let form;
</script>

<div class="max-w-4xl mx-auto p-4">
  <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
    <h1 class="text-2xl font-bold mb-2">Submit a Run Club</h1>
    <p class="text-gray-600 mb-6">Add your run club to our directory. We'll review your submission and notify you when it's approved.</p>
  
    <form method="POST" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Club Name *</label>
        <input type="text" name="name" id="name" required
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
          focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
      </div>

      <div>
        <label for="cityId" class="block text-sm font-medium text-gray-700">City *</label>
        <select name="cityId" id="cityId" required
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm
          focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
          <option value="">Select a city</option>
          {#each data.cities as city}
            <option value={city.id}>{city.name}</option>
          {/each}
        </select>
      </div>

      <div class="space-y-4">
        <div>
          <label for="day" class="block text-sm font-medium text-gray-700">Run Day(s) *</label>
          <input type="text" name="day" id="day" required 
            placeholder="e.g., Monday, Wednesday"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
          <p class="mt-1 text-xs text-gray-500">Separate multiple days with commas (e.g., "Monday, Wednesday")</p>
        </div>

        <div>
          <label for="time" class="block text-sm font-medium text-gray-700">Run Time(s) *</label>
          <input type="text" name="time" id="time" required 
            placeholder="e.g., 18:30, 07:00"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
          <p class="mt-1 text-xs text-gray-500">Use 24-hour format. For multiple days, list times in same order as days.</p>
        </div>
      </div>

      <div>
        <label for="location" class="block text-sm font-medium text-gray-700">Meeting Location *</label>
        <input type="text" name="location" id="location" required
          placeholder="e.g., Stanley Park Seawall"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
          focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
        <p class="mt-1 text-xs text-gray-500">Provide a specific meeting point that's easy to find</p>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description *</label>
        <textarea name="description" id="description" rows="4" required
          placeholder="Tell us about your run club, including pace groups, typical routes, and what makes your club unique..."
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
          focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="instagram" class="block text-sm font-medium text-gray-700">Instagram Handle</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">@</span>
            </div>
            <input type="text" name="instagram" id="instagram"
              placeholder="runclub"
              class="pl-7 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
              focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
          </div>
        </div>

        <div>
          <label for="facebook" class="block text-sm font-medium text-gray-700">Facebook URL</label>
          <input type="text" name="facebook" id="facebook"
            placeholder="runclub"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Your Email *</label>
        <input type="email" name="email" id="email" required
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
          focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
        <p class="mt-1 text-xs text-gray-500">We'll notify you when your submission is approved.</p>
      </div>

      <div class="pt-4">
        <button type="submit"
          class="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200">
          Submit Run Club
        </button>
      </div>
    </form>
  </div>

  {#if form?.success}
    <div class="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
      <p class="font-medium">Thank you for your submission!</p>
      <p class="text-sm mt-1">We'll review it shortly and notify you when it's approved.</p>
    </div>
  {:else if form?.error}
    <div class="mt-4 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
      <p class="font-medium">Submission failed</p>
      <p class="text-sm mt-1">{form.error}</p>
    </div>
  {/if}
</div> 