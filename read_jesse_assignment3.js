/*  Jesse Read
    Project 3
    07/24/13
    Theme: A music-playing application for a mobile device. */

// Global State
var remoteAvailable = false;
var localJSONAvailable = true;
var artistCollection = {};

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
    var remainingArtists = Object.keys(serverQuery.artists).length;
    // console.log(remainingArtists);
    while (remainingArtists > 0) {
        var key = Object.keys(serverQuery.artists)[(remainingArtists - 1)];
        var songCount = 0;
        var artist = {
            "name": key,
            "albums":{},
            // "albumDuration": function (albumKey),
            "totalDuration": function () {
                var artistDuration = 0;
                for (var albumKey in this.albums) {
                    this.albums[albumKey].songs.forEach(function (song) {
                        artistDuration += song.duration;
                    });
                }
                return artistDuration;
            },
            "setCanStream": function (ableToStream) {
                this.canStream = ableToStream;
            }
        }
        for (var albumKey in serverQuery.artists[key].albums) {
            artist.albums[albumKey] = serverQuery.artists[key].albums[albumKey];
            artist.albums[albumKey].trackList = function (albumKey) {
                this.songs.forEach(function (song, index) {
                    console.log("Track " + (index + 1) + ": " + song.title);
                });
            };
            songCount += artist.albums[albumKey].songs.length;
        }
        if (remoteAvailable) {
            artist.canStream = true;
        } else {
            artist.canStream = false;
        }
        artist.songCount = songCount;
        artistCollection[key] = artist;
        remainingArtists--;
    }
}

parseArtists(serverQuery);
console.log(artistCollection["Daft Punk"].totalDuration());
artistCollection["Pink Floyd"].setCanStream(false);
console.log(artistCollection["Pink Floyd"].canStream);
artistCollection["Pink Floyd"].albums["Wish You Were Here"].trackList();