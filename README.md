# Google Maps / Supercluster example

This is a small example of how to use Google Maps / Supercluster. Please check the last commit of the project ("Add feature") to see all the changes. This code is heavily inspired in the [google-maps-clustering](https://github.com/leighhalliday/google-maps-clustering/blob/master/src/App.js) project.

Live version here: https://google-maps-supercluster-example.vercel.app

## Running locally

- Clone the repository
- Install dependencies `npm install`
- Create a `.env.local` file based on the example. You'll need Google API keys. Create a new app in the [Google Cloud Console](https://console.cloud.google.com/projectcreate) and: 
  - Enable the [Google Maps JavaScript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com), then [create a API](https://console.cloud.google.com/google/maps-apis/credentials) key. Don't forget to restrict the key to be used only in a specific domain. This will give you the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` env variable.
- Start the project: `npm run dev`
- Open `http://localhost:3000`