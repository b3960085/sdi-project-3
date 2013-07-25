/*  Jesse Read
    Project 3
    07/24/13
    Theme: A music-playing application for a mobile device. */

for (var key in artistCollection.artists) {
    var artist = {
        "name": key,
        "albums": new Object(),
    }
    for (var albumKey in artistCollection.artists[key].albums) {
        console.log(albumKey);
        console.log(Object.keys(artistCollection.artists[key].albums[albumKey].songs).length);
        artist.albums[albumKey] = artistCollection.artists[key].albums[albumKey];
        //artist.albums[albumKey] = {
        //    "Test": "test",
        //    "Boogers": "boog",
        //}
    }
    console.log(artist);
}