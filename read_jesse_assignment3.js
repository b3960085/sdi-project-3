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

var artistCollection = function parseArtists (serverQuery);