/*  Jesse Read
    Project 3
    07/24/13
    Theme: A music-playing application for a mobile device. */

// Global State
var remoteAvailable = false;
var localJSONAvailable = true;

// Conditional: is remote server available?
if (!remoteAvailable) {
    // False
    console.log("Remote server unavailable, falling back to cached artist data.");
    // Nested Conditional: is there cached JSON data?
    if (!localJSONAvailable) {
        // False
        console.log("Local cache is empty. Sync failed.");
        // Throw exception with description of issue. Forces failure status and ends execution.
        throw Error('Sync engine failed to initiate. See log for more details.');
    }
}




var parseArtists = function (serverQuery) {
    for (var key in serverQuery.artists) {
        var totalDuration = 0;
        var artist = {
            "name": key,
            "albums":{},
            "duration": 0,
        }
        for (var albumKey in serverQuery.artists[key].albums) {
            var albumDuration = 0;
            //console.log(albumKey);
            //console.log(Object.keys(serverQuery.artists[key].albums[albumKey].songs).length);
            artist.albums[albumKey] = serverQuery.artists[key].albums[albumKey];
            artist.albums[albumKey].songs.forEach(function (song) {
                albumDuration += song.duration;
            });
            artist.albums[albumKey].duration = albumDuration;
            totalDuration += albumDuration
            console.log(albumDuration);
            //artist.albums[albumKey] = {
            //    "Test": "test",
            //    "Boogers": "boog",
            //}
        }
        artist.duration = totalDuration;
        console.log(totalDuration);
        console.log(artist);
    }
}

var artistCollection = parseArtists(serverQuery);