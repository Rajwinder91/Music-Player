# Music Player
   Music Player is a music website where we can search the playlist. 
 <ul>
  <li>
   Design the playlist page with add and redirect button. On click of add button, track will save in database and on redirect link it will redirect to the track view page.
 </li>
 <li>
  Implement the dropdown for showing the playlist. On selection of playlist we can search the track.
 </li>
 <li>
  Implement Discogs API to display the playlist and tracks.
 </li>
  <li>
  Save the tracks in database with playlist_id, title, uri and master id.
 </li>
</ul>
## Technologies and Web Tools
    React Js, Node Js, HTML, CSS, Visual Studio Code, Axios, Discog API, Postgres, PgAdmin

## Discog Developer link
   https://www.discogs.com/developers/

## Access Token
    XqlZmzNSfaouuXZkCazHxUXPhECkxmamqfeRmuln
 
## Setup
To run this project, install it locally using npm:
 
```jsx
npm install 
npm start
node index.js
```

## Discogs Connection
```jsx
//Doscogs API Credentials
const API_TOKEN  = "XqlZmzNSfaouuXZkCazHxUXPhECkxmamqfeRmuln"
const API_URL    = 'https://api.discogs.com/database/search'

var db = new Discogs().database();
db.getRelease(176126, function(err, data){
    //console.log(data);
});
```


