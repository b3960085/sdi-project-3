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
    while (remainingArtists > 0) {
        var key = Object.keys(serverQuery.artists)[(remainingArtists - 1)];
        var songCount = 0;
        var artist = {
            "name": key,
            "albums":{},
            "releaseYears": [],
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
            artist.albums[albumKey].name = albumKey;
            artist.albums[albumKey].trackList = function () {
                this.songs.forEach(function (song, index) {
                    console.log("Track " + (index + 1) + ": " + song.title);
                });
            };
            artist.releaseYears.push(artist.albums[albumKey].releaseYear);
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
        // Since the artist has been parsed, it can stream.
        artist.setCanStream(true);
    }

    // Local JSON has been parsed.
    localJSONAvailable = false;
}

var playlistDuration = function (artist, albumKey, arrayOfSelectedSongs) {
    var runningDuration = 0;
    for (var index in arrayOfSelectedSongs) {
        runningDuration += artist.albums[albumKey].songs[index].duration
    }
    return runningDuration;
}

var createPlaylist = function (artist, albumKey, arrayOfSelectedSongs) {
    var playlist = {}
    for (var i = 0; i < arrayOfSelectedSongs.length; i++) {
        playlist[(i+1)] = artist.albums[albumKey].songs[i];
    }
    return playlist;
}

var currentSelection = function (artist, albumKey, songIndex) {
    var album = artist.albums[albumKey];
    var song = album.songs[songIndex];
    return (song.title + " from the album " + album.name + " by " + artist.name);
}

var willSync = function () {
    if (remoteAvailable && localJSONAvailable) {
        return true;
    } else {
        return false;
    }
}

parseArtists(serverQuery);

var selectedArtist = "Daft Punk";
var selectedAlbum = "Random Access Memories";
var selectedAlbumSongs = [0, 2, 5, 3];

console.log("Synced " + Object.keys(serverQuery.artists).length + " artists into local collection.");
var artistDuration = artistCollection[selectedArtist].totalDuration();
console.log("Your selected artist, " + selectedArtist + ", has a total song duration of " + ~~(artistDuration / 60) + " minutes and " + (artistDuration % 60) + " seconds.");
var selection = currentSelection(artistCollection["Daft Punk"], "Random Access Memories", 2);
console.log("You have chosen to play " + selection + ". Here is the track list:");
artistCollection[selectedArtist].albums[selectedAlbum].trackList();
console.log("Compiling album playlist based off your song selections.");
var playlistLength = playlistDuration(artistCollection[selectedArtist], selectedAlbum, selectedAlbumSongs);
console.log("Your selected songs have a total duration of " + ~~(playlistLength / 60) + " minutes and " + (playlistLength % 60) + " seconds.");
var playlist = createPlaylist(artistCollection[selectedArtist], selectedAlbum, selectedAlbumSongs);
console.log("Enjoy listening to your playlist!");
console.log("// Debug Output:")
console.log("// " + Object.keys(serverQuery.artists).length + " artists synced.");
var willSyncNextLaunch = willSync();
console.log("// Will app sync next launch? " + willSyncNextLaunch);